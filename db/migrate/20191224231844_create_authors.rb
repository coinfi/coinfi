class CreateAuthors < ActiveRecord::Migration[5.1]
  def change
    create_table :authors do |t|
      t.string :name
      t.string :slug
      t.string :website_url
      t.string :twitter_url
      t.string :linkedin_url
      t.string :photo_url
      t.text :bio
    end
  end
end
