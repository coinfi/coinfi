module CoinsHelper
  include ActionView::Helpers::NumberHelper

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

  # Based on formatPrice in numberFormatters
  def format_price(price)
    begin
      if price >= 1000000
        number_with_delimiter(number_with_precision(price, precision: 0, raise: true))
      elsif price >= 1
        number_with_delimiter(number_with_precision(price, precision: 2, raise: true))
      elsif price >= 0.0001
        number_with_precision(price, precision: 5, strip_insignificant_zeros: true, raise: true)
      else
        number_with_precision(price, precision: 8, strip_insignificant_zeros: true, raise: true)
      end
    rescue ArgumentError, InvalidNumberError
      0
    end
  end

  def paged_index(page, page_size, index)
    ((page - 1) * page_size) + index + 1
  end

  def coins_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking],
      methods: %i[sparkline price market_cap change1h change24h change7d volume24h image_url]
    )
  end

  def seconds_to_next_day
    1.day.since.beginning_of_day - Time.now
  end

  def seconds_to_next_hour
    1.hour.since.beginning_of_hour - Time.now
  end

  def latest_total_market_cap
    latest_market_metric = MarketMetric.latest
    latest_market_metric.total_market_cap if latest_market_metric.present?
  end

  def historical_total_market_data(days: 7, months: nil)
    if days.present?
      MarketMetric.daily(days).to_a
    elsif months.present?
      MarketMetric.monthly(months).to_a
    end
  end

  def market_dominance(number_of_other_coins: 4, no_cache: false)
    unless no_cache
      cached_market_dominance = Rails.cache.read("market_dominance/#{number_of_other_coins}")
      return cached_market_dominance if cached_market_dominance.present?
    end

    total_market_cap = latest_total_market_cap

    pinned_coin_slug = 'bitcoin'
    top_coins = Coin.listed.legit.top(number_of_other_coins).where.not(slug: pinned_coin_slug)
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

    Rails.cache.write("market_dominance/#{number_of_other_coins}", market_dominance, expires_in: seconds_to_next_day) unless no_cache || total_market_cap.blank?

    market_dominance
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

  def is_ethereum?(coin)
    coin.present? && coin.coin_key == 'ethereum.org'
  end
end
