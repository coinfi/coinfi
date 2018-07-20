class RenameCoinsWebsiteDomainToCoinKey < ActiveRecord::Migration[5.1]
  def change
    rename_column :coins, :website_domain, :coin_key
    add_index :coins, :coin_key
  end
end
