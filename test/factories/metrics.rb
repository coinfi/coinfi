require 'faker'

FactoryBot.define do
  factory :metric do
    token_address { token_address }
    metric_value { Faker::Number.decimal(2) }
    metric_type { metric_type }
    sequence :date { |n| Date.today - n }

  end
end