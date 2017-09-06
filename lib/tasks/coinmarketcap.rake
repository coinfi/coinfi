require 'httparty'

CRYPTO_CURRENCIES = %w().freeze

FIAT_CURRENCIES = %w(usd btc eur cny gbp rub hkd jpy aud).freeze

namespace :coinmarketcap do
  namespace :ingest do
    desc "Ingest coin list from CryptoCompare via API"
    task :coinlist => :environment do
      file = File.read('data/coinmarketcap_coinlist.json')
      contents = JSON.parse(file)
      coinlist = contents["coins"]
      coinlist.each do |coin|
        identifier = coin["identifier"]
        puts identifier
        ticker_url = "http://coinmarketcap.northpole.ro/ticker.json?identifier=#{identifier}&version=v8"
        begin
          response = HTTParty.get(ticker_url)
          contents = JSON.parse(response.body)

          next if contents["markets"].blank?

          data = contents["markets"].first
          Coin.create(
            ranking: data["position"],
            name: data["name"],
            symbol: data["symbol"],
            category: data["category"],
            market_cap: data["marketCap"],
            price: data["price"],
            volume24: data["volume24"],
            available_supply: data["availableSupply"],
            change24h: data["change24h"],
            change1h: data["change1h"],
            change7d: data["change7d"],
            last_synced: data["timestamp"],
          )
        rescue => e
          puts e.message
        end
      end
    end

=begin
    desc "Scrape extra data (website, social media handles, etc.) from CoinMarketCap"
    task :scrape_cmc => :environment do
      Wombat.configure do |config|
        config.set_user_agent "Wombat"
        config.set_user_agent_alias "Mac Safari"
      end

      Coin.find_each do |coin|
        results = Wombat.crawl do
          base_url "https://coinmarketcap.com"
          path "/currencies/#{coin.name.downcase}"

          website css: '.row.bottom-margin-2x li a'
          website2
          explorer
          explorer2
          forum
          forum2
        end

        coin.update(results)

        sleep rand(10..16)
      end
    end
=end

    # Source: http://coinmarketcap.northpole.ro/history.json?coin=bitcoin&period=2017&format=array
    desc "Ingest specific coin's historical price data scraped from CoinMarketCap via API"
    task :historical, [:coin] => [:environment] do |task, args|
      coin = Coin.find(args.coin)
      retrieve_historical_data_cmc(coin)
    end

    desc "Ingest all coins price data from CoinMarketCap via API"
    task :all_historical => :environment do
      Coin.select(:id, :slug).find_each do |coin|
        retrieve_historical_data_cmc(coin)
      end
    end

    def retrieve_historical_data_cmc(coin)
      puts coin.slug
      url = "http://coinmarketcap.northpole.ro/history.json?coin=#{coin.slug}&period=2017&format=array"
      begin
        response = HTTParty.get(url)
        data = JSON.parse(response.body)
      rescue => e
        puts e.message
        return
      end

      if data["error"]
        puts "Not found"
        return
      end

      puts data["symbol"]
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
  end
end
