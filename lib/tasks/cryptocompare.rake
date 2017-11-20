require 'httparty'

namespace :cryptocompare do
  namespace :ingest do
    # TODO: Need to add exception handling!

    # Source: https://www.cryptocompare.com/api/#-api-data-coinlist-
    desc "Ingest coin list from CryptoCompare via API"
    task :coinlist => :environment do
      url = "https://www.cryptocompare.com/api/data/coinlist/"
      response = HTTParty.get(url)
      data = JSON.parse(response.body)
      entries = data["Data"]
      entries.each do |key, coin|
        image_url = nil
        image_url = 'https://www.cryptocompare.com' + coin["ImageUrl"] if coin["ImageUrl"]
        is_premined = nil
        is_premined = coin["FullyPremined"] == "1" if coin["FullyPremined"]

        begin
          coin = Coin.create(
            name: coin["CoinName"],
            symbol: coin["Name"],
            algorithm: coin["Algorithm"],
            proof_type: coin["ProofType"],
            image_url: image_url,
            is_premined: is_premined,
          )
        rescue => e
          puts e.message
        end

        pp coin
      end
    end

    # Only pull the top 20 currencies.
    # desc ""
    task :histohour => :environment do
      symbols = Coin.top(20).pluck(:symbol).drop(1) # Drop the first element which is generally always going to be BTC
      symbols.each do |symbol|
        symbol = "IOTA" if symbol == "MIOTA"

        url = "https://min-api.cryptocompare.com/data/histohour?fsym=#{symbol}&tsym=BTC&limit=1&aggregate=3&e=CCCAGG"
        response = HTTParty.get(url)
        data = JSON.parse(response.body)
        if data["Response"] == "Success"
          entries = data["Data"]
          entries.each do |entry|
            puts entry
            HistoHour.create(entry.merge({from_symbol: symbol, to_symbol: 'BTC'}))
          end

          volumes = HistoHour.volume_difference(symbol, 'BTC')
          before_volume = volume.first
          after_volume = volume.last

          if (after_volume >= 5 * before_volume)
            # SEND ALERT!!!
          end
        else
          puts data
        end
        sleep 5..10 # Avoid rate limit by sleeping 5-10 seconds between requests
      end
    end
  end

  namespace :prepopulate do
    task :histohour => :environment do
      symbols = Coin.top(20).pluck(:symbol).drop(1) # Drop the first element which is generally always going to be BTC
      symbols.each do |symbol|
        symbol = "IOTA" if symbol == "MIOTA"
        puts symbol

        url = "https://min-api.cryptocompare.com/data/histohour?fsym=#{symbol}&tsym=BTC&limit=2000&aggregate=3&e=CCCAGG"
        response = HTTParty.get(url)
        data = JSON.parse(response.body)
        if data["Response"] == "Success"
          entries = data["Data"]
          entries.each do |entry|
            #puts entry
            HistoHour.create(entry.merge({from_symbol: symbol, to_symbol: 'BTC'}))
          end
        else
          puts data
        end
        sleep 2 # Avoid rate limit by sleeping 5-10 seconds between requests
      end
    end
  end
end
