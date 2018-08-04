class AddColumnToCalendarEventsTable < ActiveRecord::Migration[5.1]
  def change
    add_column :calendar_events, :import_id, :bigint
    add_index :calendar_events, :import_id
  end
end
