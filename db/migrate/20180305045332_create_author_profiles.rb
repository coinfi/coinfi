class CreateAuthorProfiles < ActiveRecord::Migration[5.1]
  def change
    create_table :author_profiles do |t|
      t.references :user
      t.string :name
      t.string :company
      t.string :role
      t.string :website_url
      t.string :twitter_url
      t.string :linkedin_url
      t.string :photo
      t.text :bio
      t.string :investing_style
    end
  end
end
