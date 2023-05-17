require 'faker'

FactoryBot.define do
  factory :feed_source do
    sequence(:name) { |n| "Feed Source #{n}" }
    slug { Faker::Internet.slug(words: name, glue: '') }
    site_hostname { "#{slug}.com" }
    feed_url { Faker::Internet.url(host: site_hostname) }
    feed_type { ['twitter', 'reddit', 'general'].sample }
    is_subscribed { true }
    is_active { true }
  end
end
