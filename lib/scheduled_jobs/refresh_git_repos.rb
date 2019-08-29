require 'sidekiq-scheduler'

class RefreshGitRepos
  include Sidekiq::Worker

  def perform
    CoinServices::RefreshGitRepoStats.call
    CoinServices::CalculateGitRepoRankings.call
  end
end