class FeedSource < ApplicationRecord
  SUPERFEEDR_API_URL = 'https://push.superfeedr.com/'.freeze
  SUPERFEEDR_AUTH = { username: ENV.fetch('SUPERFEEDR_USER'), password: ENV.fetch('SUPERFEEDR_TOKEN') }.freeze
  SUPERFEEDR_RETRIEVE_BATCH_SIZE = 50.freeze

  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  has_many :news_items

  def retrieve(before: nil)
    body = {
      'hub.mode' => 'retrieve', 
      'hub.topic' => feed_url, 
      'format' => 'json', 
      'count' => SUPERFEEDR_RETRIEVE_BATCH_SIZE
    }

    body.merge!('before' => before ) if before

    options = {
      basic_auth: SUPERFEEDR_AUTH,
      body: body
    }

    results = HTTParty.get(SUPERFEEDR_API_URL, options)

    items = results['items']
    puts "Fetched #{items.size} items"
    last_item_id = items.last.try(:[], "id") #using try in case 0 items
    puts "Last item fetched: #{last_item_id}"
    #sleep(1) # to try and avoid API timeouts.  Not sure if we still need this.

    items += retrieve(before: last_item_id) unless items.size < SUPERFEEDR_RETRIEVE_BATCH_SIZE
    items
  end

  def subscribe!
    body = {
      'hub.mode' => 'subscribe', 
      'hub.topic' => feed_url, 
      'format' => 'json', 
      'hub.callback' => callback_url,
      'hub.secret' => ENV.fetch('SUPERFEEDR_SECRET')
    }

    options = {
      basic_auth: { username: ENV.fetch('SUPERFEEDR_USER'), password: ENV.fetch('SUPERFEEDR_TOKEN') },
      body: body
    }

    result = HTTParty.post(SUPERFEEDR_API_URL, options)

    puts result
  end

  def callback_url
    "#{self.class.callback_url_base}?source=#{slug}"
  end

  def self.callback_url_base
    protocol = Rails.env.development? ? 'http://' : 'https://'

    "#{protocol}#{ENV.fetch('ROOT_DOMAIN')}/webhooks/#{ENV.fetch('SUPERFEEDR_CALLBACK_URL_SEGMENT_SECRET')}-superfeedr-ingest"
  end
end
