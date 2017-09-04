require 'httparty'

CRYPTO_CURRENCIES = %w().freeze

FIAT_CURRENCIES = %w(usd btc eur cny gbp rub hkd jpy aud).freeze

# TODO: Need to add exception handling!
# Source: http://coinmarketcap.northpole.ro/history.json?coin=bitcoin&period=2017&format=array
desc "Ingest historical price data scraped from CoinMarketCap via API"
task :ingest_historical, [:coin] => [:environment] do |task, args|
  coin_name = args.coin
  coin = Coin.where('lower(name) = ?', coin_name.downcase).first # Case insensitive search

  url = "http://coinmarketcap.northpole.ro/history.json?coin=#{coin_name}&period=2017&format=array"
  response = HTTParty.get(url)
  data = JSON.parse(response.body)
  entries = data["history"]

  # How to ensure idempotency?
  entries.each do |entry|
    values = {
      "coin_id" => coin.id,
      "date" => Date.parse(entry["date"]),
      "timestamp" => entry["timestamp"],
      "supply" => entry["availableSupply"]
    }
    FIAT_CURRENCIES.each do |currency|
      values["#{currency}_price"] = entry["price"][currency]
      values["#{currency}_volume"] = entry["volume24"][currency]
    end

    begin
      DailyPrice.create(values)
    rescue => e
      puts e.message
    end
  end
end
