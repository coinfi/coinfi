class CreateContributorSubmissions < ActiveRecord::Migration[5.1]
  def change
    create_table :contributor_submissions do |t|
      t.references :user, foreign_key: {on_delete: :cascade}
      t.string :title
      t.text :summary
      t.text :content
      t.references :submission_category, foreign_key: true
      t.integer :status, null: false, default: 0
      t.text :disclosure

      t.timestamps
    end
  end
end
