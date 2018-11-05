namespace :coinmarketcap do
  namespace :cronjobs do
    desc "Update market dominance cache"
    task :market_dominance_update => :environment do
      Coin.live_market_dominance
    end
  end
end