require 'httparty'

namespace :coinmarketcap do
  namespace :cronjobs do
    # Direct ticker access
    desc "10min ticker price update"
    task :ticker_update => :environment do
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
            ico_status: 'listed'
          )
        rescue => e
          puts e.message
        end
      end
    end

    desc "Daily updates from CMC"
    task :daily_update => :environment do
      Coin.listed.find_each do |coin|
        puts coin.slug
        ticker_url = "https://api.coinmarketcap.com/v1/ticker/#{coin.slug}/?convert=BTC"
        begin
          response = HTTParty.get(ticker_url)
          contents = JSON.parse(response.body)

          next if contents.none?

          data = contents.first
          coin.update(
            max_supply: data["max_supply"]
          )
        rescue => e
          puts e.message
        end
      end
    end

    # Grab history but only keep most recent day.
    desc "Most recent daily price update"
    task :last_daily_update, [:coin] => :environment do |task, args|
      if args.coin
        coin = Coin.find(args.coin)
        insert_last_historical_data(coin, '2017')
      else
        Coin.select(:id, :slug).each do |coin|
          insert_last_historical_data(coin, '2017')
        end
      end
    end

    # Grab history but only keep most recent hour.
    desc "Most recent hourly price update"
    task :last_hourly_update, [:coin] => :environment do |task, args|
      if args.coin
        coin = Coin.find(args.coin)
        insert_last_historical_data(coin, '14days')
      else
        Coin.select(:id, :slug).each do |coin|
          insert_last_historical_data(coin, '14days')
        end
      end
    end
  end # End Cronjobs

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

    desc "Scrape images from CoinMarketCap"
    task :scrape_images => :environment do
      Coin.where("image_url is null or image_url = ''").each do |coin|
        puts coin.slug

        begin
          results = Wombat.crawl do
            base_url "https://coinmarketcap.com"
            path "/currencies/#{coin.slug}"

            image_url xpath: "//*[@class='currency-logo-32x32']/@src"
          end

          file = results['image_url'].split('/').last
          results['image_url'] = "https://res.cloudinary.com/coinfi/image/upload/coinlogos/#{file}"
          pp results

          coin.update(results)
        rescue => e
          puts e.message
        end
      end
    end

    # Source: http://coinmarketcap.northpole.ro/history.json?coin=bitcoin&period=2017&format=array
    desc "Ingest coin daily historical price data scraped from CoinMarketCap via API"
    task :daily_historical, [:coin] => :environment do |task, args|
      if args.coin
        coin = Coin.find(args.coin)
        insert_all_historical_data(coin, '2017')
      else
        Coin.select(:id, :slug).find_each do |coin|
          insert_all_historical_data(coin, '2017')
        end
      end
    end

    # Source: http://coinmarketcap.northpole.ro/history.json?coin=bitcoin&period=14days&format=array
    desc "Ingest specific coin's hourly historical price data scraped from CoinMarketCap via API"
    task :hourly_historical, [:coin] => :environment do |task, args|
      if args.coin
        coin = Coin.find(args.coin)
        insert_all_historical_data(coin, '14days')
      else
        Coin.select(:id, :slug).find_each do |coin|
          insert_all_historical_data(coin, '14days')
        end
      end
    end
  end
end

def coinlist
  file = File.read('data/coinmarketcap_coinlist.json')
  contents = JSON.parse(file)
  contents["coins"]
end

def retrieve_historical_data(coin, period)
  puts coin.slug
  url = "http://coinmarketcap.northpole.ro/history.json?coin=#{coin.slug}&period=#{period}&format=array"
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

def insert_all_historical_data(coin, period)
  entries = retrieve_historical_data(coin, period)
  if period == "2017"
    entries.each do |entry|
      create_daily_price(coin.id, entry)
    end
  elsif period == "14days"
    return if entries.blank?
    entries.each do |datetime, entry|
      entry["datetime"] = datetime
      create_hourly_price(coin.id, entry)
    end
  else
    raise "UnknownPeriodError"
  end
end

def insert_last_historical_data(coin, period)
  entries = retrieve_historical_data(coin, period)

  return if entries.blank?

  if period == "2017"
    entry = entries.last
    create_daily_price(coin.id, entry)
  elsif period == "14days"
    return if entries.blank?
    entries = entries.to_a
    item = entries.last

    date_string = item.first # Key
    entry = item.last # Value (Hash)
    entry["datetime"] = date_string
    create_hourly_price(coin.id, entry)
  else
    raise "UnknownPeriodError"
  end
end

def create_daily_price(coin_id, entry)
  begin
    DailyPrice.create(
      "coin_id" => coin_id,
      "date" => Date.parse(entry["date"]),
      "timestamp" => entry["timestamp"],
      "supply" => entry["availableSupply"],
      "price" => entry["price"],
      "volume24" => entry["volume24"],
    )
  rescue => e
    puts e.message
  end
end

def create_hourly_price(coin_id, entry)
  begin
    HourlyPrice.create(
      "coin_id" => coin_id,
      "datetime" => DateTime.strptime(entry["datetime"], "%H-%d-%m-%Y"),
      "timestamp" => entry["timestamp"],
      "supply" => entry["availableSupply"],
      "price" => entry["price"],
      "volume24" => entry["volume24"],
    )
  rescue => e
    puts e.message
  end
end
