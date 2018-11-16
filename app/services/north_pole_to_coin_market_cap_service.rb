class NorthPoleToCoinMarketCapService
  def initialize(north_pole_response)
    @body = JSON.parse(north_pole_response.body)
  end

  # Converts NorthPole proxy data format into the CoinMarketCap format.
  def convert
    market = @body["markets"][0]
    {
      "rank" => market["position"],
      "price_usd" => market["price"]["usd"],
      "price_btc" => market["price"]["btc"],
      "24h_volume_usd" => market["volume24"]["usd"],
      "market_cap_usd" => market["marketCap"]["usd"],
    }
  end
end
