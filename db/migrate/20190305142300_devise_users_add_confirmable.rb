class DeviseUsersAddConfirmable < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    add_column :users, :confirmation_token, :string
    add_column :users, :confirmed_at, :datetime
    add_column :users, :confirmation_sent_at, :datetime
    add_column :users, :unconfirmed_email, :string

    add_index :users, :confirmation_token, unique: true, algorithm: :concurrently

    User.update_all confirmed_at: DateTime.now, confirmation_sent_at: DateTime.now
  end

  def down
    remove_columns :users, :confirmation_token, :confirmed_at, :confirmation_sent_at, :unconfirmed_email
  end
end
