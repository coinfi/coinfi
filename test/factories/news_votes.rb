require 'faker'

FactoryBot.define do
  factory :news_vote do
    user_id { :user_id }
    news_item_id { :news_item_id }
    vote { Faker::Number.between(-1, 1) }
  end
end
