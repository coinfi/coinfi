class CreateCurators < ActiveRecord::Migration[5.1]
  def change
    create_table :curators do |t|
      t.references :user, foreign_key: true
      t.decimal :trust_score, precision: 13, scale: 10
      t.integer :tokens_staked
    end

    create_table :curators_calendar_events do |t|
      t.references :curator
      t.references :calendar_event
      t.decimal :confidence_score, precision: 13, scale: 10
      t.boolean :voted_confirm

      t.timestamps
    end
  end
end
