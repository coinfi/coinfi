class AddNewFieldsToCoinsTable < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :eth_address, :string
    add_column :coins, :country, :string
    add_column :coins, :share_of_tokens_for_sale, :float
    add_column :coins, :external_key, :jsonb
    add_column :coins, :facebook, :string
    add_column :coins, :telegram, :string
    add_column :coins, :total_supply, :bigint
    add_column :coins, :description, :text
    add_column :coins, :team, :jsonb
    add_column :coins, :external_rating, :jsonb
  end
end
