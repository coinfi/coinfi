namespace :data_migrations do
  desc "Migrate github repo to git repo with type"
  task :migrate_github_repo_to_git_repo_with_type => :environment do
    coins = Coin.where.not(github_repo: nil)

    batch_process(coins) do |coin|
      coin.git_repo = coin.github_repo
      coin.git_repo_type = "github"
      coin.save!
    end

    # curated coins
    tezos = Coin.find_by(slug: 'tezos')
    tezos.update!(git_repo_type: "gitlab") if tezos.present?
  end
end
