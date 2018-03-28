FactoryBot.define do
  factory :user do
    email {Faker::Internet.email}
    password 'password'
    token_sale do
      {'waitlisted' => false, 'ethereum_address' => 'xxx'}
    end
  end
end
