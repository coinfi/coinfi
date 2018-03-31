class AddLogoUrlToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :logo_url, :string
  end
end
