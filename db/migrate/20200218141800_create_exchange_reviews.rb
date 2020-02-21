class CreateExchangeReviews < ActiveRecord::Migration[5.1]
  def change
    create_table :exchange_reviews do |t|
      t.references :author, foreign_key: {on_delete: :cascade}
      t.references :cmc_exchange, foreign_key: {on_delete: :cascade}
      t.string :slug, null: false, index: { unique: true }
      t.string :h1
      t.string :meta_title
      t.string :meta_description
      t.text :summary
      t.text :content
      t.text :deposit
      t.text :withdrawal
      t.text :fees
      t.text :available_countries
      t.text :payment_methods
      t.integer :fees_rating
      t.integer :ease_of_use_rating
      t.integer :security_rating
      t.integer :support_rating
      t.integer :selection_rating

      t.timestamps
    end
  end
end
