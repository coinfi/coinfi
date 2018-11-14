class CreateSignalTriggers < ActiveRecord::Migration[5.1]
  def change
    create_table :signal_triggers do |t|
      t.string :type
      t.jsonb :params, null: false, default: {}

      t.timestamps
    end

    add_index :signal_triggers, :type
  end
end
