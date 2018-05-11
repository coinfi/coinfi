class CoinMarketCapService
  def ticker_update
    @failed_updates = []
    data = load_cmc_ticker_data
    coins(data).each do |coin|
      identifier = coin["identifier"]
      update_coin(identifier, coin)
    end
    pp @failed_updates
  end

  private

  def update_coin(identifier, data)
    coin = Coin.find_by(slug: identifier)
    @failed_updates << identifier and return if coin.nil?
    coin.update!(
      ranking: data["position"],
      market_cap: data["marketCap"],
      price: data["price"],
      volume24: data["volume24"],
      available_supply: data["availableSupply"],
      change24h: data["change24h"],
      change1h: data["change1h"],
      change7d: data["change7d"],
      last_synced: data["timestamp"],
      ico_status: 'listed'
    )
  end

  def coins(data)
    data["markets"]
  end

  def load_cmc_ticker_data
    ticker_url = "http://coinmarketcap.northpole.ro/ticker.json?identifier=&version=v8"
    response = HTTParty.get(ticker_url)
    JSON.parse(response.body)
  end
end
