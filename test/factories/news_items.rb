require 'faker'

FactoryBot.define do
  factory :news_item do
    feed_source
    sequence(:feed_item_id) { |n| "#{Faker::Internet.url(host: feed_source.site_hostname)}#{n}" }
    url { feed_item_id }
    title { Faker::Lorem.sentence }
    summary { "<p>#{Faker::Lorem.sentence}</p>" }
    content { "<p>#{Faker::Lorem.paragraph}</p>" }
    actor_id { Faker::Name.name }
    feed_item_published_at { Faker::Date.between(from: 1.week.ago, to: Date.today) }
    feed_item_updated_at { Faker::Date.between(from: 1.week.ago, to: Date.today) }
    importance { 0 }
    is_published { Faker::Boolean.boolean(true_ratio: 0.9) }

    trait :with_category do
      transient do
        category_id { NewsCategory.pluck(:id).sample }
      end

      after(:create) do |news, evaluator|
        # tag news with category
        begin
          NewsItemCategorization.create(
            news_item_id: news.id,
            news_category_id: evaluator.category_id
          )
        rescue ActiveRecord::RecordNotUnique
          # The record already exists.
        end
      end
    end

    factory :news_item_with_category do
      with_category
    end
  end
end
