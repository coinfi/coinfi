namespace :data_migrations do
  desc "Generate github repo from github url"
  task :generate_github_repo_from_github_url => :environment do
    coins = Coin.where.not(github: nil)

    batch_process(coins) do |coin|
      github_path = URI(coin.github).path
      next unless github_path.present?

      github_path_array = github_path.sub!(%r{^/}, '').split('/')
      if github_path_array.size == 2 # has repo, i.e., (name|org)/(repo name)
        coin.github_repo ||= github_path_array.join('/')
        coin.save!
      elsif github_path_array.size > 2
        puts "NOTICE: #{coin.name} might have a github repo: #{github_path_array.join('/')}"
      end
    end
  end
end
