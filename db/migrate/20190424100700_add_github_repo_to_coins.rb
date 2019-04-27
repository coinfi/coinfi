class AddGithubRepoToCoins < ActiveRecord::Migration[4.2]
  def change
    add_column :coins, :github_repo, :string
  end
end
