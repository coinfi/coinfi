module CoinsHelper
  MAX_ACCEPTABLE_REPLICATION_LAG = ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG

  def display_percentage_change(percentage_change)
    return "N/A" if percentage_change.nil?
    return "0.0%" if percentage_change == 0
    sign = percentage_change > 0 ? "+" : ""
    color = percentage_change > 0 ? "green" : "sunset"
    "<span class='#{color}'>#{sign}#{percentage_change}%</span>".html_safe
  end

  def custom_number_to_currency(amount, options = {})
    amount = amount || 0
    custom = {
      precision: amount < 1.0 ? 6 : 2
    }
    number_to_currency(amount, options.merge(custom))
  end

  def display_available_supply(coin)
    coin.available_supply.try(:>, 0) ? "#{number_with_delimiter(coin.available_supply)} #{coin.symbol}" : ""
  end

  def humanize input, prefix = '', suffix = ''
    return input unless input.to_f > 0
    "#{prefix}#{number_to_human(input, number_to_human_options)}#{suffix}"
  end

  def number_to_human_options
    {
      delimiter: ',',
      format: "%n%u",
      precision: 2,
      significant: false,
      units: {
        million: 'M',
        billion: 'B',
        trillion: 'T'
      }
    }
  end

  def paged_index(page, page_size, index)
    ((page - 1) * page_size) + index + 1
  end

  def coins_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking image_url],
      methods: %i[sparkline price market_cap change1h change24h change7d volume24h]
    )
  end

  def latest_total_market_cap
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      latest_market_metric = MarketMetric.latest
      latest_market_metric.total_market_cap if latest_market_metric.present?
    end
  end

  def historical_total_market_data(days: 7, months: nil)
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      if days.present?
        MarketMetric.daily(days)
      elsif months.present?
        MarketMetric.monthly(months)
      end
    end
  end

  def live_market_dominance(number_of_other_coins: 4, no_cache: false)
    total_market_cap = latest_total_market_cap

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      pinned_coin_slug = 'bitcoin'
      top_coins = Coin.listed.top(number_of_other_coins).where.not(slug: pinned_coin_slug)
      pinned_coin = Coin.where(slug: pinned_coin_slug)
      coins = Coin.from("((#{top_coins.to_sql}) UNION (#{pinned_coin.to_sql})) AS coins")
      market_dominance = coins.map do |coin|
        market_cap = coin.market_cap || 0
        market_percentage = total_market_cap.present? ? market_cap / total_market_cap : 0
        [coin.coin_key, {
          :id => coin.id,
          :name => coin.name,
          :symbol => coin.symbol,
          :slug => coin.slug,
          :price_usd => coin.price || 0,
          :market_percentage => market_percentage
        }]
      end.to_h

      Rails.cache.write("market_dominance/#{number_of_other_coins}", market_dominance, expires_at: 1.day.since.beginning_of_day) unless no_cache || total_market_cap.blank?

      market_dominance
    end
  end

  def market_dominance(number_of_other_coins: 4)
    cached_market_dominance = Rails.cache.read("market_dominance/#{number_of_other_coins}")
    return cached_market_dominance if cached_market_dominance.present?

    live_market_dominance(number_of_other_coins: number_of_other_coins)
  end

  def market_percentage(coin_key)
    coin = market_dominance[coin_key]
    coin[:market_percentage]
  end

  def serialized_dominance
    coins = market_dominance
      .sort_by { |k, v| -v[:market_percentage] }
      .flat_map { |v| v[1] }

    coins.as_json
  end
end
