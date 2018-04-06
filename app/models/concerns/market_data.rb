module MarketData
  extend ActiveSupport::Concern
  include ActionView::Helpers::NumberHelper
  include CoinsHelper

  def live_market_data
    Rails.cache.fetch(
      "/coins/#{symbol}/market_data",
      { expires_in: 1.minute }
    ) do
      url = "https://api.coinmarketcap.com/v1/ticker/#{slug}/?convert=BTC"
      response = HTTParty.get(url)
      data = JSON.parse(response.body)[0] || {}
      data["available_supply"] ||= self.available_supply
      data
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
