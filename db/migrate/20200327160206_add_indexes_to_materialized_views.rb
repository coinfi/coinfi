class AddIndexesToMaterializedViews < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!
  def change
    add_index :news_votes_trendings, :id, unique: true, algorithm: :concurrently
    add_index :token_supplies, :coin_key, unique: true, algorithm: :concurrently
    add_index :token_retentions, :coin_key, unique: true, algorithm: :concurrently
    add_index :token_adoptions, :coin_key, unique: true, algorithm: :concurrently
    add_index :token_decentralizations, :coin_key, unique: true, algorithm: :concurrently
    add_index :token_velocities, :coin_key, unique: true, algorithm: :concurrently
    add_index :daily_token_supplies, [:coin_key, :date], unique: true, name: 'index_daily_token_supplies', algorithm: :concurrently
    add_index :daily_token_retentions, [:coin_key, :date], unique: true, name: 'index_daily_token_retentions', algorithm: :concurrently
    add_index :daily_token_adoptions, [:coin_key, :date], unique: true, name: 'index_daily_token_adoptions', algorithm: :concurrently
    add_index :daily_token_decentralizations, [:coin_key, :date], unique: true, name: 'index_daily_token_decentralizations', algorithm: :concurrently
    add_index :daily_token_velocities, [:coin_key, :date], unique: true, name: 'index_daily_token_velocities', algorithm: :concurrently
  end
end
