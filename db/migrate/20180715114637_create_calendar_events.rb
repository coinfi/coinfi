class CreateCalendarEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :calendar_events do |t|
      t.references :creator
      t.string :name
      t.text :description
      t.datetime :date_event
      t.datetime :date_added
      t.string :source_url
      t.string :screenshot_url
      t.string :status
      t.bigint :approvals
      t.bigint :disapprovals
      t.integer :confidence 
    end
    add_foreign_key :calendar_events, :users, column: :creator_id

    create_table :calendar_event_coins do |t|
      t.references :event
      t.references :coin
    end

    create_table :calendar_event_categorizations do |t|
      t.references :event
      t.references :news_category
    end
  end
end
