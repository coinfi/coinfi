class Api::SocialFeedsController < ApiController

  def tweets_by_user
    tweets = twitter_client.user_timeline(params[:user])
    respond_success tweets
  end

  private

  def twitter_client 
    Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV.fetch('TWITTER_CONSUMER_KEY')
      config.consumer_secret     = ENV.fetch('TWITTER_CONSUMER_SECRET')
      config.access_token        = ENV.fetch('TWITTER_ACCESS_TOKEN')
      config.access_token_secret = ENV.fetch('TWITTER_ACCESS_SECRET')
    end
  end
  
end