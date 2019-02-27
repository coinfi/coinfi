require 'httparty'

namespace :coinmarketcap do
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
            github xpath: "//a[text()='Source Code']/@href"
            # image_url xpath: "//*[@class='currency-logo-32x32']/@src"
            # Reddit link is lazy loaded so unable to parse
          end
          results.compact!
          pp results

          coin.update!(results)
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
  end
end

def coinlist
  file = File.read('data/coinmarketcap_coinlist.json')
  contents = JSON.parse(file)
  contents["coins"]
end