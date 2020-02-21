class CreateExchangeReviewCategorizations < ActiveRecord::Migration[5.1]
  def change
    create_table :exchange_review_categorizations do |t|
      t.references :exchange_review, foreign_key: {on_delete: :cascade}
      t.references :exchange_category, foreign_key: {on_delete: :cascade}
      t.integer :ranking
    end

    add_index :exchange_review_categorizations, [:exchange_review_id, :exchange_category_id], unique: true, :name => 'unique_index_exchange_review_categorizations'
  end
end
