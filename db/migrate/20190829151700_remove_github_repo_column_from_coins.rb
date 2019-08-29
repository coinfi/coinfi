class RemoveGithubRepoColumnFromCoins < ActiveRecord::Migration[4.2]
  def change
    safety_assured do
      remove_column :coins, :github_repo
    end
  end
end
