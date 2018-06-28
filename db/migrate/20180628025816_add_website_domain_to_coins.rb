class AddWebsiteDomainToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :website_domain, :string, unique: true
  end
end
