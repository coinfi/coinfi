require_relative 'batch_process'

namespace :feeds do
  desc "Subscribe to all the feeds"
  task :subscribe_all => :environment do
    batch_process(FeedSource.active.all) do |source|
      source.subscribe!
    end
  end

  desc "Unsubscribe to all the feeds"
  task :unsubscribe_all do
    raise "Make sure PLA-164 is complete before using this again because superfeedr account is now shared between staging and dev"
    subs = FeedSource.active.fetch_all_subscriptions

    subs.each do |res_item|
      sub = res_item["subscription"]
      body = {
        'hub.mode' => 'unsubscribe', 
        'hub.topic' => sub["feed"]["url"],
        'hub.callback' => sub["endpoint"]
      }

      options = {
        basic_auth: FeedSource::SUPERFEEDR_AUTH,
        body: body
      }

      result = HTTParty.post(FeedSource::SUPERFEEDR_API_URL, options)
      puts result
    end
  end

  # example usage to retrieve just one feed: rake feeds:retrieve_items["coinidol"]
  desc "Retrieve items"
  task :retrieve_items, [:feed_slug] => :environment do |task, args|
    feeds = nil
    feed_slug = args[:feed_slug]
    feeds = feed_slug.present? ? FeedSource.active.where(slug: feed_slug) : FeedSource.active

    batch_process(feeds) do |feed|
      puts feed.name
      feed.retrieve!
    end
  end

  #FIXME This isn't a reliable way to parse the twitter_user because some of them
  #have twitter urls like "https://twitter.com/cardanostiftung?lang=en"
  #not going to fix it now because not sure if we'll ever use this again
  desc "Build Feeds Source for all coins twitter feeds"
  task :build_all_feed_sources_for_twitter  => :environment do
    #using batch_process here just for error_handling e.g. since we have manually created one of these already
    #we just want it to skip the unique constraint error that will be thrown and keep going to create the rest
    batch_process(Coin.where.not(twitter: nil).where.not(twitter: "")) do |coin|
      twitter_user = coin.twitter.split("/").last
      FeedSource.create!(
        name: coin.name + " Twitter",
        feed_url: "https://twitrss.me/twitter_user_to_rss/?user=#{twitter_user}",
        site_url: coin.twitter,
        feed_type: 'twitter'
      )
    end
  end

  desc "Build Feeds Source for all coins reddit feeds"
  task :build_all_feed_sources_for_reddit  => :environment do
    #using batch_process here just for error_handling e.g. since we have manually created one of these already
    #we just want it to skip the unique constraint error that will be thrown and keep going to create the rest
    batch_process(Coin.where.not(reddit: nil).where.not(reddit: "")) do |coin|
      FeedSource.create!( 
        name: coin.name + " Reddit",
        feed_url: coin.reddit + ".rss",
        site_url: coin.reddit,
        feed_type: 'reddit'
      )
    end
  end

  desc "Check if all feed sources are subscribed"
  task :check_all_feed_source_subscriptions  => :environment do
    not_subscribed_ids = FeedSource.ids_without_subs
    if not_subscribed_ids.empty?
      puts "All Feed Sources are subscribed"
    else
      puts "These feed sources are not subscribed #{not_subscribed_ids}"
    end
  end
end
