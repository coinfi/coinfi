namespace :coinmarketcap do
  namespace :cronjobs do
    desc "Update total market cap"
    task :total_market_cap_update => :environment do
      total_market_cap = Coin.live_total_market_cap
      MarketCap.create(total_market_cap: total_market_cap)
    end

    desc "Update market dominance cache"
    task :market_dominance_update => :environment do
      Coin.live_market_dominance
    end
  end
end