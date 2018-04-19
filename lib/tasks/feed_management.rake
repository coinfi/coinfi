require_relative 'batch_process'

SUPERFEEDR_AUTH = { username: ENV.fetch('SUPERFEEDR_USER'), password: ENV.fetch('SUPERFEEDR_TOKEN') }

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
    api_url = 'https://push.superfeedr.com/'
    body = {
      'hub.mode' => 'list', 
      'by_page' => 500, # This is the max supported by SuperFeedr
    }

    options = {
      basic_auth: SUPERFEEDR_AUTH,
      body: body
    }

    subs = HTTParty.get(api_url, options)

    subs.each do |res_item|
      sub = res_item["subscription"]
      body = {
        'hub.mode' => 'unsubscribe', 
        'hub.topic' => sub["feed"]["url"],
        'hub.callback' => sub["endpoint"]
      }

      options = {
        basic_auth: SUPERFEEDR_AUTH,
        body: body
      }

      result = HTTParty.post(api_url, options)
      puts result
    end
  end
end
