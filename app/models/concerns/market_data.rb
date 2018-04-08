module MarketData
  extend ActiveSupport::Concern
  include ActionView::Helpers::NumberHelper
  include CoinsHelper

  def live_market_data
    return default_market_data unless ico_listed?
    Rails.cache.fetch(
      "/coins/#{symbol}/market_data",
      { expires_in: 1.minute }
    ) do
      url = "https://coinmarketcap.northpole.ro/ticker.json?identifier=#{slug}&version=v8"
      response = HTTParty.get(url)
      data = JSON.parse(response.body) || {}
      default_market_data.merge(transform_northpole_data(data))
    end
  end

  def market_info market_data = nil
    data = market_data || live_market_data.dup
    data["24h_volume_usd"] = humanize(data["24h_volume_usd"], '$') if data["24h_volume_usd"]
    data["available_supply"] = humanize(data["available_supply"]) if data["available_supply"]
    data["market_cap_usd"] = humanize(data["market_cap_usd"], '$') if data["market_cap_usd"]
    data["total_supply"] = humanize(data["total_supply"]) if data["total_supply"]
    data
  end

  def stored_market_info
    market_info({
      "24h_volume_usd": self.volume24['usd'],
      "available_supply": display_available_supply(self),
      "market_cap_usd": self.market_cap['usd'],
      "price_usd": "$#{self.price['usd']}"
    }.stringify_keys)
  end

  private

  def default_market_data
    {'available_supply' => available_supply, 'total_supply' => max_supply}
  end

  def transform_northpole_data(data)
    {
      '24h_volume_usd' => data.dig('markets', 0, 'volume24', 'usd'),
      'available_supply' => data.dig('markets', 0, 'availableSupply'),
      'market_cap_usd' => data.dig('markets', 0, 'marketCap', 'usd'),
      'price_usd' => data.dig('markets', 0, 'price', 'usd'),
      'percent_change_24h' => data.dig('markets', 0, 'change24h')
    }
  end

  # TODO: Refactor into presentation helper
  def humanize number, prefix = '', suffix = ''
    "#{prefix}#{number_to_human(number, number_to_human_options)}#{suffix}"
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
end
