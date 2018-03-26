class AddIcoFieldsToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :ico_status, :string

    add_column :coins, :ico_usd_raised, :bigint
    add_column :coins, :ico_start_date, :bigint
    add_column :coins, :ico_end_date, :bigint

    add_column :coins, :ico_token_price_usd, :decimal, precision: 10, scale: 2
    add_column :coins, :ico_token_price_btc, :decimal, precision: 24, scale: 16
    add_column :coins, :ico_token_price_eth, :decimal, precision: 24, scale: 16

    add_column :coins, :ico_personal_cap_usd_min, :decimal, precision: 10, scale: 2
    add_column :coins, :ico_personal_cap_usd_max, :decimal, precision: 10, scale: 2

    add_column :coins, :ico_fundraising_goal_usd, :decimal, precision: 18, scale: 2
    add_column :coins, :ico_fundraising_goal_eth, :decimal, precision: 24, scale: 16
    add_column :coins, :ico_fundraising_status_usd, :decimal, precision: 18, scale: 2
    add_column :coins, :ico_fundraising_status_eth, :decimal, precision: 24, scale: 16

    add_column :coins, :ico_tokens_sold, :decimal, precision: 32, scale: 16

    add_column :coins, :ico_returns_usd, :float
    add_column :coins, :ico_returns_btc, :float
    add_column :coins, :ico_returns_eth, :float

    add_column :coins, :influencer, :jsonb

    add_column :coins, :excluded_countries, :jsonb, array: true

    add_column :coins, :blockchain_tech, :string
    add_column :coins, :token_type, :string

    add_column :coins, :exchanges, :jsonb, array: true
  end
end

=begin
ico_status string:("active", "upcoming", "ended")

ico_usd_raised int
ico_start_date int (epoch)
ico_end_date int (epoch)

ico_token_price_usd decimal(8,2)
ico_token_price_btc decimal(8,16)
ico_token_price_eth decimal(8, 16)

ico_personal_cap_usd_min decimal(8,2)
ico_personal_cap_usd_max decimal(8,2)

ico_fundraising_goal_usd decimal(16,2)
ico_fundraising_goal_eth decimal(8,16)
ico_fundraising_status_usd decimal(16,2)
ico_fundraising_status_eth decimal(8,16)

ico_tokens_sold decimal(16,16)

ico_returns_usd float
ico_returns_btc float
ico_returns_eth float

influencer jsonb

excluded_countries jsonb (array)

blockchain_tech stringtoken_type string ("ERC-20", "NEP-5")

exchanges jsonb (array)
=end
