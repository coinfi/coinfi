class FeedSource < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  has_many :news_items

  def subscribe!
    subscribe_api_url = 'https://push.superfeedr.com/'
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

    result = HTTParty.post(subscribe_api_url, options)

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
