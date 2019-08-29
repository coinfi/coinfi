class AddGitColumnsForCoins < ActiveRecord::Migration[4.2]
  def change
    add_column :coins, :git_repo, :string
    add_column :coins, :git_repo_type, :string
  end
end
