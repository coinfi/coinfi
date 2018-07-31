class AddConfirmableToDevise < ActiveRecord::Migration[5.1]
  def up
    add_column :users, :confirmation_token, :string
    add_column :users, :confirmed_at, :datetime
    add_column :users, :confirmation_sent_at, :datetime
    add_column :users, :unconfirmed_email, :string
    add_index :users, :confirmation_token, unique: true

    # Update all existing user accounts to be confirmed to allow log in.
    now = DateTime.now
    User.all.update_all(confirmation_sent_at: now, confirmed_at: now)
  end

  def down
    remove_columns :users, :confirmation_token, :confirmed_at, :confirmation_sent_at, :unconfirmed_email
  end
end
