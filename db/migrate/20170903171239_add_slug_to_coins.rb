class AddSlugToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :slug, :string, unique: true
  end
end
