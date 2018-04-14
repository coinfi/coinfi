class AddUniqueIndexToCoinName < ActiveRecord::Migration[5.1]
  def change
    add_index :coins, :name, unique: true
  end
end
