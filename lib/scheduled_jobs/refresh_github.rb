require 'sidekiq-scheduler'

class RefreshGithub
  include Sidekiq::Worker

  def perform
    CoinServices::RefreshGithubStats.call
  end
end