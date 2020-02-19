namespace :data_migrations do
  desc "Seed Exchanges for Exchanges Reviews"
  task :seed_exchanges_for_exchange_reviews => :environment do
    CmcExchange.find_or_create_by(cmc_id: 'changelly') do |exchange|
      exchange.name = 'Changelly'
      exchange.slug = 'changelly'
      exchange.www_url = 'https://changelly.com/'
      exchange.twitter_url = 'https://twitter.com/changelly_team'
      exchange.blog_url = 'https://medium.com/@Changelly'
      exchange.chat_url = 'https://t.me/join_changelly'
      exchange.logo_url = 'https://changelly.com/static/favicons/favicon-32x32.png'
      exchange.is_active = true
    end
    CmcExchange.find_or_create_by(cmc_id: 'coin-switch') do |exchange|
      exchange.name = 'CoinSwitch'
      exchange.slug = 'coin-switch'
      exchange.www_url = 'https://coinswitch.co/'
      exchange.twitter_url = 'https://twitter.com/coinswitch'
      exchange.blog_url = 'https://blog.coinswitch.co/'
      exchange.chat_url = 'https://t.me/coinswitch_community'
      exchange.fee_url = 'https://coinswitch.co/faq#desktopcollapseInnerFour'
      exchange.logo_url = 'https://files.coinswitch.co/public/images/favicon_new.png'
      exchange.is_active = true
    end
    CmcExchange.find_or_create_by(cmc_id: 'ftx') do |exchange|
      exchange.name = 'FTX'
      exchange.slug = 'ftx'
      exchange.www_url = 'https://ftx.com/'
      exchange.twitter_url = 'https://twitter.com/FTX_official'
      exchange.blog_url = 'https://blog.ftx.com/'
      exchange.chat_url = 'https://t.me/FTX_Official'
      exchange.fee_url = 'https://ftexchange.zendesk.com/hc/en-us/articles/360024479432-Fees'
      exchange.logo_url = 'https://ftx.com/favicon-32x32.png'
      exchange.is_active = true
    end
    CmcExchange.find_or_create_by(cmc_id: 'bybit') do |exchange|
      exchange.name = 'Bybit'
      exchange.slug = 'bybit'
      exchange.www_url = 'https://www.bybit.com/'
      exchange.twitter_url = 'https://twitter.com/Bybit_Official'
      exchange.blog_url = 'https://medium.com/bybit'
      exchange.chat_url = 'https://t.me/BybitTradingChat'
      exchange.fee_url = 'https://www.bybit.com/app/contract/cost'
      exchange.logo_url = 'https://www.bybit.com/favicon.ico'
      exchange.is_active = true
    end
  end
end
