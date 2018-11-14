class CreateSignalNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :signal_notifications do |t|
      t.string :external_id, unique: true
      t.references :signal, foreign_key: true
      t.string :signal_external_id, unique: true
      t.references :user, foreign_key: true
      t.timestamp :timestamp

      t.jsonb :extra, null: false, default: {}

      t.timestamps
    end
  end
end
