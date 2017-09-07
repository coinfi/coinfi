require 'httparty'

namespace :coinmarketcap do
  desc "Single daily price update"
  task :single_daily_update, [:coin] => :environment do |task, args|
    coin = Coin.find(args.coin)
    insert_1d_historical_data(coin)
  end

  desc "Daily price update"
  task :daily_update => :environment do
    # Grab history but only keep most recent day.
    Coin.select(:id, :slug).each do |coin|
      insert_1d_historical_data(coin)
    end
  end

  desc "10min price update"
  task :ten_min_update => :environment do
    Coin.find_each do |coin|
      puts coin.slug
      ticker_url = "http://coinmarketcap.northpole.ro/ticker.json?identifier=#{coin.slug}&version=v8"
      begin
        response = HTTParty.get(ticker_url)
        contents = JSON.parse(response.body)

        next if contents["markets"].blank?

        data = contents["markets"].first
        coin.update(
          ranking: data["position"],
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

  namespace :ingest do
    desc "Ingest coin list from CoinMarketCap via API"
    task :coinlist => :environment do
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
            slug: coin["identifier"],
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

    desc "Scrape extra data (website, social media handles, etc.) from CoinMarketCap"
    task :scrape_meta => :environment do
      Coin.find_each do |coin|
        puts coin.slug

        begin
          results = Wombat.crawl do
            base_url "https://coinmarketcap.com"
            path "/currencies/#{coin.slug}"

            name xpath: "//div[@id='metadata']/@data-name"
            website xpath: "//a[text()='Website']/@href"
            website2 xpath: "//a[text()='Website 2']/@href"
            explorer xpath: "//a[text()='Explorer']/@href"
            explorer2 xpath: "//a[text()='Explorer 2']/@href"
            forum xpath: "//a[text()='Message Board']/@href"
            forum2 xpath: "//a[text()='Message Board 2']/@href"
            twitter xpath: "//*[@class='twitter-timeline']/@href"
            image_url xpath: "//*[@class='currency-logo-32x32']/@src"
            # Reddit link is lazy loaded so unable to parse
          end

          coin.update(results)
        rescue => e
          puts e.message
        end
      end
    end

    # Source: http://coinmarketcap.northpole.ro/history.json?coin=bitcoin&period=2017&format=array
    desc "Ingest specific coin's historical price data scraped from CoinMarketCap via API"
    task :historical, [:coin] => [:environment] do |task, args|
      coin = Coin.find(args.coin)
      insert_all_historical_data(coin)
    end

    desc "Ingest all coins price data from CoinMarketCap via API"
    task :all_historical => :environment do
      Coin.select(:id, :slug).find_each do |coin|
        insert_all_historical_data(coin)
      end
    end
  end

  def coinlist
    file = File.read('data/coinmarketcap_coinlist.json')
    contents = JSON.parse(file)
    contents["coins"]
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
    data["history"]
  end

  def insert_all_historical_data(coin)
    entries = retrieve_historical_data_cmc(coin)
    entries.each do |entry|
      create_daily_price(coin.id, entry)
    end
  end

  def insert_1d_historical_data(coin)
    entries = retrieve_historical_data_cmc(coin)

    return if entries.blank?
    entry = entries.last

    create_daily_price(coin.id, entry)
  end

  def create_daily_price(coin_id, entry)
    values = {
      "coin_id" => coin_id,
      "date" => Date.parse(entry["date"]),
      "timestamp" => entry["timestamp"],
      "supply" => entry["availableSupply"],
      "price" => entry["price"],
      "volume24" => entry["volume24"]
    }

    begin
      DailyPrice.create(values)
    rescue => e
      puts e.message
    end
  end
end
