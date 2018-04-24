require_relative 'batch_process'

namespace :feeds do
  desc "Subscribe to all the feeds"
  task :subscribe_all => :environment do
    batch_process(FeedSource.all) do |source|
      puts source.name
      source.subscribe!
    end
  end

  desc "Unsubscribe to all the feeds"
  task :unsubscribe_all do
    raise "Make sure PLA-164 is complete before using this again because superfeedr account is now shared between staging and dev"
    body = {
      'hub.mode' => 'list', 
      'by_page' => 500, # This is the max supported by SuperFeedr
    }

    options = {
      basic_auth: FeedSource::SUPERFEEDR_AUTH,
      body: body
    }

    subs = HTTParty.get(FeedSource::SUPERFEEDR_API_URL, options)

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
    feeds = feed_slug.present? ? FeedSource.where(slug: feed_slug) : FeedSource.all

    batch_process(feeds) do |feed|
      puts feed.name
      items = feed.retrieve
      items.map!{|item| HashWithIndifferentAccess.new(item)} #since ingest is using symbols to access the hash
      items.each{|item| NewsItemRaw.ingest!(item, feed.slug)}
    end
  end
end
