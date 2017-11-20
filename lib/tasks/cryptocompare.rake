require 'httparty'
require 'pony'

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
      puts "Running CryptoCompare HistoHour Volume Detection Signal, storing gathered data..."

      symbols = Coin.top(20).pluck(:symbol).drop(1) # Drop the first element which is generally always going to be BTC
      symbols.each do |symbol|
        symbol = "IOT" if symbol == "MIOTA" # CryptoCompare is IOT, CoinMarketCap is MIOTA
        puts symbol

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
          before_volume = volumes.first
          after_volume = volumes.last

          mail_text = "#{symbol} current hour volume of #{after_volume} is > 5x the previous hour volue of #{before_volume}."

          #if (after_volume > 0 && after_volume >= 5 * before_volume)
          if (after_volume >= 5 * before_volume)
            puts "ALERT: #{mail_text}"
            Pony.mail({
              from: 'CoinFi AlertBot <alerts@coinfi.com>',
              to: 'admin@coinfi.com',
              subject: 'Volume Alert',
              body: mail_text,
              charset: 'utf-8',
              via: :smtp,
              via_options: {
                address: 'smtp.webfaction.com',
                port: 587,
                enable_starttls_auto: true,
                user_name: 'coinfi',
                password: ENV.fetch('WEBFACTION_SMTP_PASSWORD'),
                authentication: :plain,
                domain: 'coinfi.com',
              }
            })
          end
        else
          puts data
        end
        sleep(rand(3..5)) # Avoid rate limit by sleeping 5-10 seconds between requests
      end
    end
  end
end
