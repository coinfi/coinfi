require 'faker'

FactoryBot.define do
  factory :coin do
    sequence(:name) { |n| "#{Faker::CryptoCoin.coin_name}#{n}" }
    slug { Faker::Internet.slug(name, '') }
    symbol { Faker::Internet.slug(name, '').upcase }
    coin_key { "#{symbol.downcase}.com" }
    website { Faker::Internet.url(coin_key) }
    explorer { "https://etherscan.io/token/#{symbol}" }
    explorer2 { "https://ethplorer.io/address/#{Faker::Crypto.sha256}" }
    sequence(:ranking)
    is_listed { Faker::Boolean.boolean(0.9) }
    ico_status { is_listed ? 'listed' : Coin::ICO_STATUSES.without('listed').sample }

    after(:build) do |coin, evaluator|
      coin_hash = {
        :change1h => Faker::Number.decimal(2),
        :change24h => Faker::Number.decimal(2),
        :change7d => Faker::Number.decimal(2),
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
  end
end
