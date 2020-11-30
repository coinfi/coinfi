require 'sidekiq-scheduler'
class ProcessRawNewsItems
  include Sidekiq::Worker

  def perform
    NewsServices::ProcessNewsItemRaws.call
  end
end