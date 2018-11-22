class NorthPoleToCoinMarketCapService
  def initialize(north_pole_response)
    @body = JSON.parse(north_pole_response.body)
  end

  # Converts NorthPole proxy data format into the CoinMarketCap format.
  def convert
    if @body["markets"]
      market = @body["markets"][0]
      {
        "rank" => market.fetch("position", 0),
        "price_usd" => market.dig("price", "usd") || 0,
        "price_btc" => market.dig("price", "btc") || 0,
        "24h_volume_usd" => market.dig("volume24", "usd") || 0,
        "market_cap_usd" => market.dig("marketCap", "usd") || 0,
      }
    else # The slug passed in isn't valid on CMC...
      {
        "rank" => "Unknown",
        "price_usd" => 0,
        "price_btc" => 0,
        "24h_volume_usd" => 0,
        "market_cap_usd" => 0,
      }
    end
  end
end
