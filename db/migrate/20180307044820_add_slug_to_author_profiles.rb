class AddSlugToAuthorProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :author_profiles, :slug, :string, uniq: true
    add_index :author_profiles, :slug
  end
end
