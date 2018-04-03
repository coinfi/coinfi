module MarketData
  extend ActiveSupport::Concern
  included do
  end

  def market_data
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
end
