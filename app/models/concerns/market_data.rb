module MarketData
  extend ActiveSupport::Concern
  include ActionView::Helpers::NumberHelper

  def market_data
    return default_market_data unless ico_listed?
    Rails.cache.fetch(
      "/coins/#{symbol}/market_data",
      { expires_in: 1.minute }
    ) do
      url = "https://api.coinmarketcap.com/v1/ticker/#{slug}/?convert=BTC"
      response = HTTParty.get(url)
      data = JSON.parse(response.body)[0] || {}
      default_market_data.merge(data)
    end
  end

  def market_info
    data = market_data.dup
    data["24h_volume_usd"] = humanize(data["24h_volume_usd"], '$') if data["24h_volume_usd"]
    data["available_supply"] = humanize(data["available_supply"]) if data["available_supply"]
    data["market_cap_usd"] = humanize(data["market_cap_usd"], '$') if data["market_cap_usd"]
    data["total_supply"] = humanize(data["total_supply"]) if data["total_supply"]
    data
  end

  private

  def default_market_data
    {'available_supply' => available_supply}
  end

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
