require 'faker'

FactoryBot.define do
  factory :exchange do
    sequence(:name) { |n| "#{Faker::Company.name}#{n}" }
    slug { Faker::Internet.slug(words: name, glue: '').downcase }
    ccxt_id { slug }
    www_url { "https://#{slug}.com" }
    logo_url { Faker::Company.logo }
  end
end
