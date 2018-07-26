class CreateCalendarEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :calendar_events do |t|
      t.references :user
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
    add_foreign_key :calendar_events, :users

    create_table :calendar_event_coins do |t|
      t.references :calendar_event
      t.references :coin
    end

    create_table :calendar_event_categorizations do |t|
      t.references :calendar_event
      t.references :news_category
    end
  end
end
