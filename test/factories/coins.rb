require 'faker'

FactoryBot.define do
  factory :coin do
    sequence(:name) { |n| "#{Faker::CryptoCoin.coin_name}#{n}" }
    slug { Faker::Internet.slug(words: name, glue: '') }
    symbol { Faker::Internet.slug(words: name, glue: '').upcase }
    coin_key { "#{symbol.downcase}.com" }
    website { Faker::Internet.url(host: coin_key) }
    eth_address { Faker::Crypto.sha256 }
    explorer { "https://etherscan.io/token/#{symbol}" }
    explorer2 { "https://ethplorer.io/address/#{eth_address}" }
    sequence(:ranking)
    is_listed { true } # Not clear what this is for, but it shouldn't be the default: Faker::Boolean.boolean(true_ratio: 0.9)
    ico_status { is_listed ? 'listed' : Coin::ICO_STATUSES.without('listed').sample }
    token_decimals { Faker::Number.between(from: 18, to: 23) }

    after(:build) do |coin, evaluator|
      coin_hash = {
        :change1h => Faker::Number.decimal(l_digits: 2),
        :change24h => Faker::Number.decimal(l_digits: 2),
        :change7d => Faker::Number.decimal(l_digits: 2),
        :available_supply => 0,
        :total_supply => 0,
        :max_supply => 0,
        :volume24 => 14283706.289258223,
        :price => 0.578642621116,
        :market_cap => 312051963.132,
      }
      Rails.cache.write("#{coin.slug}:snapshot", coin_hash)
    end

    trait :with_listings do
      after(:build) do |coin, evaluator|
        coin.exchange_listings << build_list(:exchange_listing, 3, quote_coin: coin)
      end
    end

    trait :with_feed_sources do
      feed_sources { build_list(:feed_source, 3) }
    end

    factory :coin_with_news_items do
      with_feed_sources

      transient do
        machine_tagged_news_items_count { 3 }
        human_tagged_news_items_count { 3 }
      end

      after(:create) do |coin, evaluator|
        evaluator.machine_tagged_news_items_count.times do |i|
          begin
            coin.machine_tagged_news_items << create(:news_item_with_category, feed_source: coin.feed_sources.sample)
          rescue ActiveRecord::RecordNotUnique
            # The record already exists.
          end
        end
        evaluator.human_tagged_news_items_count.times do |i|
          begin
            coin.human_tagged_news_items << create(:news_item_with_category, feed_source: coin.feed_sources.sample)
          rescue ActiveRecord::RecordNotUnique
            # The record already exists.
          end
        end
      end
    end

    factory :coin_with_metrics do
      transient do
        metric_types { TokensHelper::METRIC_TYPES.map { |t| t[:value] } }
      end

       after(:create) do |coin, evaluator|
        evaluator.metric_types.each do |value|
          create_list(:metric, 30, token_address: coin.eth_address, metric_type: value)
        end

         RefreshTokenMetricsViewsService.call(concurrently: false)
      end
    end
  end
end
