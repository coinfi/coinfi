require 'faker'

FactoryBot.define do
  factory :news_item do
    feed_source
    sequence(:feed_item_id) { |n| "#{Faker::Internet.url(feed_source.site_hostname)}#{n}" }
    url { feed_item_id }
    title { Faker::Lorem.sentence }
    summary { "<p>#{Faker::Lorem.sentence}</p>" }
    content { "<p>#{Faker::Lorem.paragraph}</p>" }
    actor_id { Faker::Name.name }
    feed_item_published_at { Faker::Date.between(1.week.ago, Date.today) }
    feed_item_updated_at { Faker::Date.between(1.week.ago, Date.today) }
    importance { 0 }
    is_published { Faker::Boolean.boolean(0.9) }
  end
end
