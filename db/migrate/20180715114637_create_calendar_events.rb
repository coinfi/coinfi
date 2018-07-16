class CreateCalendarEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :calendar_events do |t|
      t.references :coin
      t.references :user
      t.string :name
      t.text :description
      t.datetime :date_event
      t.datetime :date_added
      t.string :source
      t.string :status
      t.bigint :approvals
      t.bigint :disapprovals
      t.integer :confidence 
    end

    create_table :calendar_event_categorizations do |t|
      t.references :event
      t.references :news_category
    end
  end
end
