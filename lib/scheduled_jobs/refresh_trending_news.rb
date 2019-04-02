require 'sidekiq-scheduler'
class RefreshTrendingNews
  include Sidekiq::Worker

  def perform
    NewsServices::RefreshNewsVotesTrendingView.call
  end
end