class ChangeIcoDatesFromEpochToTimestamp < ActiveRecord::Migration[5.1]
  def up
    rename_column :coins, :ico_start_date, :ico_start_epoch
    rename_column :coins, :ico_end_date, :ico_end_epoch
    add_column :coins, :ico_start_date, :datetime
    add_column :coins, :ico_end_date, :datetime

    Coin.where.not(ico_start_date: nil).find_each do |coin|
      coin.update(
        ico_start_date: DateTime.strptime(coin.ico_start_epoch.to_s, "%s"),
        ico_end_date: DateTime.strptime(coin.ico_end_epoch.to_s, "%s"),
      )
    end
  end

  def down
    remove_column :coins, :ico_start_date
    remove_column :coins, :ico_end_date

    add_column :coins, :ico_start_date, :bigint
    add_column :coins, :ico_end_date, :bigint

    Coin.where.not(ico_start_epoch: nil).find_each do |coin|
      coin.update(
        ico_start_date: coin.ico_start_epoch,
        ico_end_date: coin.ico_end_epoch,
      )
    end

    remove_column :coins, :ico_start_epoch
    remove_column :coins, :ico_end_epoch
  end
end
