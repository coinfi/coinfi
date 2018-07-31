class AddColumnsToCoinsTable < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :is_listed, :boolean
    add_column :coins, :external_url, :jsonb
  end
end
