namespace :data_migrations do
  desc "Seed Exchanges for Exchanges Reviews"
  task :seed_exchanges_for_exchange_reviews => :environment do
    changelly = CmcExchange.find_or_create_by(name: 'Changelly') do |exchange|
      exchange.cmc_id = 'changelly'
      exchange.slug = 'changelly'
    end
    changelly.update(
      www_url: 'https://changelly.com',
      twitter_url: 'https://twitter.com/changelly_team',
      blog_url: 'https://medium.com/@Changelly',
      chat_url: 'https://t.me/join_changelly',
      logo_url: 'https://changelly.com/static/favicons/favicon-32x32.png',
      is_active: true
    )
    coinswitch = CmcExchange.find_or_create_by(name: 'CoinSwitch') do |exchange|
      exchange.cmc_id = 'coinswitch'
      exchange.slug = 'coinswitch'
    end
    coinswitch.update(
      www_url: 'https://coinswitch.co',
      twitter_url: 'https://twitter.com/coinswitch',
      blog_url: 'https://blog.coinswitch.co',
      chat_url: 'https://t.me/coinswitch_community',
      fee_url: 'https://coinswitch.co/faq#desktopcollapseInnerFour',
      logo_url: 'https://files.coinswitch.co/public/images/favicon_new.png',
      is_active: true
    )
    ftx = CmcExchange.find_or_create_by(name: 'FTX') do |exchange|
      exchange.cmc_id = 'ftx'
      exchange.slug = 'ftx'
    end
    ftx.update(
      www_url: 'https://ftx.com',
      twitter_url: 'https://twitter.com/FTX_official',
      blog_url: 'https://blog.ftx.com',
      chat_url: 'https://t.me/FTX_Official',
      fee_url: 'https://ftzendesk.com/hc/en-us/articles/360024479432-Fees',
      logo_url: 'https://ftx.com/favicon-32x32.png',
      is_active: true
    )
    bybit = CmcExchange.find_or_create_by(name: 'Bybit') do |exchange|
      exchange.cmc_id = 'bybit'
      exchange.slug = 'bybit'
    end
    bybit.update(
      www_url: 'https://www.bybit.com',
      twitter_url: 'https://twitter.com/Bybit_Official',
      blog_url: 'https://medium.com/bybit',
      chat_url: 'https://t.me/BybitTradingChat',
      fee_url: 'https://www.bybit.com/app/contract/cost',
      logo_url: 'https://www.bybit.com/favicon.ico',
      is_active: true
    )
    coinmama = CmcExchange.find_or_create_by(name: 'Coinmama') do |exchange|
      exchange.cmc_id = 'coinmama'
      exchange.slug = 'coinmama'
    end
    coinmama.update(
      www_url: 'https://www.coinmama.com',
      twitter_url: 'https://twitter.com/coinmama',
      blog_url: 'https://www.coinmama.com/blog',
      fee_url: 'https://support.coinmama.com/hc/en-us/articles/360012659019',
      logo_url: 'https://www.coinmama.com/assets/img/favicon/favicon.ico',
      is_active: true
    )
    coinbase = CmcExchange.find_or_create_by(name: 'Coinbase') do |exchange|
      exchange.cmc_id = 'coinbase'
      exchange.slug = 'coinbase'
    end
    coinbase.update(
      www_url: 'https://www.coinbase.com',
      twitter_url: 'https://twitter.com/coinbase',
      blog_url: 'https://blog.coinbase.com',
      fee_url: 'https://help.coinbase.com/en/coinbase/trading-and-funding/pricing-and-fees/fees.html',
      logo_url: 'https://assets.coinbase.com/assets/favicon-32x32.d4c99c275565ed6e271c914063d2c1bc.png',
      is_active: true
    )
    paxful = CmcExchange.find_or_create_by(name: 'Paxful') do |exchange|
      exchange.cmc_id = 'paxful'
      exchange.slug = 'paxful'
    end
    paxful.update(
      www_url: 'https://www.paxful.com',
      twitter_url: 'https://twitter.com/paxful',
      blog_url: 'https://paxful.com/blog',
      fee_url: 'https://paxful.com/support/en-us/articles/360013609793-Paxful-fees',
      logo_url: 'https://www.paxful.com/assets/images/favicons/favicon-32x32.png',
      is_active: true
    )
  end
end
