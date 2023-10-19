class CheckCmcOhclvService < Patterns::Service
  attr_reader :failed_tests, :failed_coins, :failed_cached_coins

  INDICATOR_COIN_KEYS = IndicatorsHelper::INDICATOR_COIN_KEYS

  def initialize(check_time: nil, granularity: 'daily')
    @failed_tests = []
    @failed_coins = []
    @failed_cached_coins = []

    check_time = Time.current unless check_time.present?

    if granularity == 'hourly'
      raise "No hourly data"

      @granularity = 'hourly'
      @check_time = check_time.beginning_of_hour
      @table = {
        name: "hourly_ohcl_prices",
        interval: "1 hour",
        url: ENV.fetch('HEALTHCHECK_HOURLY_PRICES')
      }
      @coin_tests = [
        {
          title: "Bitcoin",
          query: lambda { Coin.where(symbol: 'BTC') }
        },
        {
          title: "Ethereum",
          query: lambda { Coin.where(symbol: 'ETH') }
        },
        {
          title: "CoinFi",
          query: lambda { Coin.where(symbol: 'COFI') }
        },
        {
          title: "Top 10",
          query: lambda { Coin.top(10) }
        },
        {
          title: "Random 3",
          query: lambda { Coin.listed.legit.order("RANDOM()").limit(3) }
        }
      ]
    elsif
      @granularity = 'daily'
      @check_time = check_time.beginning_of_day
      @table = {
        name: "daily_ohcl_prices",
        interval: "1 day",
        url: ENV.fetch('HEALTHCHECK_DAILY_PRICES')
      }
      @coin_tests = [
        {
          title: "Indicator Coins",
          query: lambda { Coin.where(coin_key: INDICATOR_COIN_KEYS) }
        }
      ]
    else
      raise "No #{@granularity} data"
    end
  end

  def call
    checkout_connection
    check_coins
    log_results
    ping_health_check
  ensure
    checkin_connection
  end

  def check_coins
    @coin_tests.each do |coin_test|
      # Check each individual coin within a test
      coins = coin_test[:query].call.to_a

      if coins.length == 0
        @failed_tests << coin_test[:title]
        next
      end

      coins.each do |coin|
        coin_id = coin.id
        coin_key = coin.coin_key.to_s
        ranking = coin.ranking
        label = "#{@granularity.capitalize}:#{coin_test[:title]}:#{coin_key}"
        puts "Checking #{label}"

        query = <<~SQL
          SELECT
            COUNT(*) AS count,
            MIN(volume_to) AS volume,
            MAX(time) AS time,
            coin_id
          FROM #{@table[:name]}
          WHERE coin_id = #{coin_id}
            and time >= '#{@check_time}'::timestamp - '#{@table[:interval]}'::INTERVAL
          GROUP BY coin_id;
        SQL

        result = @connection.exec_query(query)

        if result.empty? then
          @failed_coins << coin_key
          next
        end

        # Check results.
        # This should only be one row since we're only checking one coin at a time (and it's grouped).
        row = result.first

        check_volume = ranking.present? && ranking < 100
        has_volume = row["volume"].to_f > 0
        has_results = row["count"] > 0

        # There should be at least one entry and volume should be non-zero if ranking < 100
        if !has_results || (check_volume && !has_volume) then
          @failed_coins << coin_key
          @failed_cached_coins << coin_key # Assume failed since no db result
          next
        end

        # Double-check that we've cached the latest results
        latest_cached_price_data = get_latest_cached_price_data coin
        if latest_cached_price_data.blank?
          # Force refresh before flagging as missing
          if @granularity == 'daily'
            coin.prices_data(force_refresh: true)
          else
            raise "Could not refresh cached price data for selected granularity: #{@granularity}"
          end

          latest_cached_price_data = get_latest_cached_price_data coin
          if latest_cached_price_data.blank?
            @failed_cached_coins << coin_key
            next
          end
        end

        latest_cached_timestamp = DateTime.parse(latest_cached_price_data["time"])
        db_timestamp = DateTime.parse(row["time"])
        if latest_cached_timestamp != db_timestamp
          # Force refresh before flagging as incorrect
          if @granularity == 'daily'
            coin.prices_data(force_refresh: true)
          else
            raise "Could not refresh cached price data for selected granularity: #{@granularity}"
          end

          latest_cached_price_data = get_latest_cached_price_data coin
          latest_cached_timestamp = DateTime.parse(latest_cached_price_data["time"])
          if latest_cached_timestamp != db_timestamp
            @failed_cached_coins << coin_key
          end
        end
      end
    end
  end

  def get_latest_cached_price_data(coin)
    if @granularity == 'daily'
      coin.prices_data.reverse!.first # prices_data is fetched as ASC
    # elsif @granularity == 'hourly'
    #   latest_cached_price_data = coin.hourly_prices_data.reverse!.first # hourly_prices_data is fetched as ASC
    else
      raise "Could not find cached price data for selected granularity: #{@granularity}"
    end
  end

  def log_results
    @failed_tests = @failed_tests.uniq
    @failed_tests.each do |name|
      puts "WARNING - TEST FAILED: Could not retrieve coins for test #{name}."
    end

    @failed_coins = @failed_coins.uniq
    @failed_coins.each do |coin_key|
      puts "WARNING - COIN FAILED: #{coin_key} does not have latest #{@granularity} data in `#{@table[:name]}` table."
    end

    @failed_cached_coins = @failed_cached_coins.uniq
    @failed_cached_coins.each do |coin_key|
      puts "WARNING - COIN FAILED: #{coin_key} does not have latest #{@granularity} data in redis cache."
    end
  end

  def ping_health_check
    if @failed_tests.empty? && @failed_coins.empty? then
      Net::HTTP.get(URI.parse(@table[:url]))
    else
      error_body = {
        table: @table[:name],
        coins: @failed_coins,
        cached_coins: @failed_cached_coins,
        tests: @failed_tests,
      }
      Net::HTTP.post(URI.parse("#{@table[:url]}/fail"), error_body.to_json)
    end
  end

  def checkout_connection
    @connection = ActiveRecord::Base.connection_pool.checkout
  end

  def checkin_connection
    ActiveRecord::Base.connection_pool.checkin(@connection)
  end
end