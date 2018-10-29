class CreateStakedCofiTransactions < ActiveRecord::Migration[5.1]
  def change
    create_table :staked_cofi_transactions do |t|
      t.references :user, foreign_key: true
      t.string :txn_block_number
      t.datetime :txn_timestamp
      t.string :txn_hash
      t.string :txn_block_hash
      t.string :txn_from
      t.string :txn_to
      t.string :txn_value
      t.integer :txn_token_decimal
      t.boolean :is_txn_confirmations_gte_10

      t.timestamps
    end

    add_index :staked_cofi_transactions, :txn_hash, unique: true
    add_index :staked_cofi_transactions, :is_txn_confirmations_gte_10
    add_index :staked_cofi_transactions, :txn_block_number
  end
end
