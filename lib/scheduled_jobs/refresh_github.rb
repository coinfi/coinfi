require 'sidekiq-scheduler'

class RefreshGithub
  include Sidekiq::Worker

  def perform
    CoinServices::RefreshGithubStats.call
    CoinServices::CalculateGithubRankings.call
  end
end