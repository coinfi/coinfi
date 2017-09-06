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
  end
end
