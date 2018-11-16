require_relative '../../lib/tasks/batch_process'

class CoinMarketCapService
  attr_accessor :failed_updates

  def initialize
    @failed_updates = []
    @missing_data = []
  end

  def supply_update
    coins = load_northpole_ticker_data
    batch_process(coins) do |coin|
      identifier = coin['identifier']
      update_coin_supply(identifier, coin)
    end
    log_failed_updates
  end

  def ticker_update(start = 0, limit = 100)
    coins = load_cmc_latest_data(start, limit)
    unless coins.nil?
      batch_process(coins) do |coin|
        identifier = coin['slug']
        update_coin_prices(identifier, coin)
      end
      log_failed_updates
      log_missing_data
    end
  end

  private

  def log_failed_updates
    @failed_updates.sort! { |left, right| left[:ranking] <=> right[:ranking] }
    @failed_updates.each do |update|
      Rails.logger.info "MISSING COIN: Rank #{update[:ranking]} #{update[:identifier]} coin from CMC is missing from the `coins` table."
    end
    unless @failed_updates.empty?
      Rollbar.error('Coins table missing CMC coins', :coins => @failed_updates)
    end
  end

  def log_missing_data
    if @missing_data.empty?
      Net::HTTP.get(URI.parse(ENV.fetch('HEALTHCHECK_SNAP_PRICES')))
    else
      Net::HTTP.post(URI.parse("#{ENV.fetch('HEALTHCHECK_SNAP_PRICES')}/fail"), @missing_data.to_json)
    end
  end

  def has_missing_data(data)
    quote = data.dig("quote", currency)
    if quote["price"].blank? || quote["market_cap"].blank? || quote["volume_24h"].blank? ||
      quote["percent_change_1h"].blank? || quote["percent_change_24h"].blank? ||
      quote["percent_change_7d"].blank? || data["total_supply"].blank? ||
      data['circulating_supply'].blank? || data['max_supply'].blank? then
      return true
    else
      return false
    end
  end

  def update_coin_prices(identifier, data)
    if has_missing_data(data)
      @missing_data << { identifier: identifier, data: data }
    else
      perform_update_prices(data)
    end

    coin = Coin.find_by(slug: identifier)
    if !coin
      @failed_updates << { identifier: identifier, ranking: data['cmc_rank'] }
    else
      perform_update_ranking(coin, data)
    end
  end

  def update_coin_supply(identifier, data)
    coin = Coin.find_by(slug: identifier)
    if !coin
      @failed_updates << { identifier: identifier, ranking: data['position'].to_i }
    else
      perform_update_supply(coin, data)
    end
  end

  def perform_update_prices(data)
    quote = data.dig("quote", currency)
    coin_hash = {
      :price => quote["price"],
      :market_cap => quote["market_cap"],
      :volume24h => quote["volume_24h"],
      :change1h => quote["percent_change_1h"],
      :change24h => quote["percent_change_24h"],
      :change7d => quote["percent_change_7d"],
      :total_supply => data["total_supply"],
      :available_supply => data['circulating_supply'],
      :max_supply => data['max_supply'],
      :last_retrieved => Time.now.utc.to_s,
    }
    Rails.cache.write("#{data['slug']}:snapshot", coin_hash)
  end

  def perform_update_ranking(coin, data)
    coin.update(
        ranking: data['cmc_rank'],
        last_synced: data['last_updated'],
        ico_status: 'listed'
      )
  end

  def perform_update_supply(coin, data)
    coin.update(
      ranking: data['position'],
      market_cap: data['marketCap'],
      price: data['price'],
      volume24: data['volume24'],
      change24h: data['change24h'],
      change1h: data['change1h'],
      change7d: data['change7d'],
      last_synced: data['timestamp'],
      ico_status: 'listed'
    )
  end

  def load_northpole_ticker_data
    ticker_url = 'http://coinmarketcap.northpole.ro/ticker.json?identifier=&version=v8'
    response = HTTParty.get(ticker_url)
    contents = JSON.parse(response.body)

    contents['markets']
  end

  def load_cmc_latest_data(start, limit)
    ticker_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
    query = { :start => start, :limit => limit }
    headers = { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
    response = HTTParty.get(ticker_url, :query => query, :headers => headers)
    contents = JSON.parse(response.body)

    # ping health check if api error
    json_response_code = contents.dig('status', 'error_code') || 0
    error_message = contents.dig('status', 'error_message')

    if response.success? && json_response_code == 0 then
      Net::HTTP.get(URI.parse(ENV.fetch('HEALTHCHECK_SNAP_PRICES')))
      return contents['data']
    else
      Net::HTTP.post(URI.parse("#{ENV.fetch('HEALTHCHECK_SNAP_PRICES')}/fail"), "ERROR HTTP(#{response.code}) JSON(#{json_response_code}): #{error_message}")
      return nil
    end

    contents['data']
  end

  def currency
    return "USD"
  end
end
