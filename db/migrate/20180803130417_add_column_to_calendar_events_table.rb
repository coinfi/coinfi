class AddColumnToCalendarEventsTable < ActiveRecord::Migration[5.1]
  def change
    add_column :calendar_events, :import_id, :bigint
  end
end
