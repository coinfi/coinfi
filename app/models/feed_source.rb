class FeedSource < ApplicationRecord
  SUPERFEEDR_API_URL = 'https://push.superfeedr.com/'.freeze
  SUPERFEEDR_AUTH = {
    username: ENV.fetch('SUPERFEEDR_USER'),
    password: ENV.fetch('SUPERFEEDR_TOKEN'),
  }.freeze
  SUPERFEEDR_RETRIEVE_BATCH_SIZE = 50
  SUPERFEEDR_MAX_PER_PAGE = 500

  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  belongs_to :coin, optional: true
  has_many :news_items

  scope :active, -> { where(is_active: true) }
  scope :general, -> { where(feed_type: 'general') }
  scope :reddit, -> { where(feed_type: 'reddit') }
  scope :not_reddit, -> { where.not(feed_type: 'reddit') }
  scope :twitter, -> { where(feed_type: 'twitter') }
  scope :not_twitter, -> { where.not(feed_type: 'twitter') }
  scope :coindesk, -> { where(slug: 'coindesk') }
  scope :cointelegraph, -> { where(slug: 'cointelegraph') }
  scope :ambcrypto, -> { where(slug: 'ambcrypto') }

  def self.feed_types
    pluck(:feed_type).uniq
  end

  def self.fetch_subs(page = 1)
    # TODO: Change this now that we have > 500 subscriptions
    body = {
      'hub.mode' => 'list',
      'by_page' => FeedSource::SUPERFEEDR_MAX_PER_PAGE, # This is the max supported by SuperFeedr
      'page' => page
    }

    options = {
      basic_auth: FeedSource::SUPERFEEDR_AUTH,
      query: body
    }

    puts "Fetching Page #: #{page}"
    response = HTTParty.get(FeedSource::SUPERFEEDR_API_URL, options)

    response.parsed_response.map{|r| r["subscription"]}
  end

  def self.fetch_all_subs
    subs = []
    page = 0
    loop do
      page += 1
      new_subs = fetch_subs(page)
      subs += new_subs
      break if new_subs.size < FeedSource::SUPERFEEDR_MAX_PER_PAGE
    end

    subs
  end

  def self.ids_without_subs
    all_subs = fetch_all_subs
    fs_ids_missing_subs = []
    FeedSource.active.find_each do |fs|
      fs_ids_missing_subs << fs.id unless all_subs.any? { |sub| sub["feed"]["url"] == fs.feed_url and sub["endpoint"] == fs.callback_url }
    end
    fs_ids_missing_subs
  end

  def retrieve(before: nil)
    body = {
      'hub.mode' => 'retrieve',
      'hub.topic' => feed_url,
      'format' => 'json',
      'count' => FeedSource::SUPERFEEDR_RETRIEVE_BATCH_SIZE
    }

    body.merge!('before' => before ) if before

    options = {
      basic_auth: FeedSource::SUPERFEEDR_AUTH,
      body: body
    }

    results = HTTParty.get(FeedSource::SUPERFEEDR_API_URL, options)

    items = results['items']
    puts "Fetched #{items.size} items"
    last_item_id = items.last.try(:[], "id") # using try in case 0 items
    puts "Last item fetched: #{last_item_id}"

    items += retrieve(before: last_item_id) unless items.size < FeedSource::SUPERFEEDR_RETRIEVE_BATCH_SIZE
    items
  end

  def retrieve!
    retrieve.each do |item|
      # Since ingest is using symbols to access the hash.
      NewsItemRaw.ingest!(ActiveSupport::HashWithIndifferentAccess.new(item), slug)
    end
  end

  def subscribe!(is_subscribe = true)
    body = {
      'hub.mode' => is_subscribe ? 'subscribe' : 'unsubscribe',
      'hub.topic' => feed_url,
      'format' => 'json',
      'hub.callback' => callback_url,
      'hub.secret' => ENV.fetch('SUPERFEEDR_SECRET')
    }

    options = {
      basic_auth: FeedSource::SUPERFEEDR_AUTH,
      body: body
    }

    HTTParty.post(FeedSource::SUPERFEEDR_API_URL, options)

    # If the line above fails it throws an error so if we got here,
    # we can assume this one has subscribed successfully.
    update(is_subscribed: is_subscribe)
  end

  def subscribed?
    query = {
      'hub.mode' => 'list',
      'search[feed][url]' => feed_url,
      'format' => 'json',
    }

    options = {
      basic_auth: FeedSource::SUPERFEEDR_AUTH,
      query: query
    }

    subs_with_this_feed_url = HTTParty.get(FeedSource::SUPERFEEDR_API_URL, options)
    subs_with_this_feed_url.any?{|sub| sub["subscription"]["endpoint"] == callback_url}
  end

  def unsubscribe!
    subscribe!(false)
  end

  def replay!(count = nil)
    query = {
      'hub.mode' => 'replay',
      'hub.topic' => feed_url,
      'hub.callback' => callback_url,
      'async' => true
    }

    if count.present? && count.is_a?(Integer)
      query.merge!('count' => count)
    end

    options = {
      basic_auth: FeedSource::SUPERFEEDR_AUTH,
      query: query
    }

    puts HTTParty.get(FeedSource::SUPERFEEDR_API_URL, options)
  end

  def set_active!(setting = true)
    ApplicationRecord.transaction do
      update(is_active: !!setting)
      news_items.update_all(is_published: !!setting)
    end
  end

  private

  def callback_url
    "#{self.class.callback_url_base}?source=#{slug}"
  end

  def self.callback_url_base
    protocol = Rails.env.development? ? 'http://' : 'https://'

    "#{protocol}#{ENV.fetch('ROOT_DOMAIN')}/webhooks/#{ENV.fetch('SUPERFEEDR_CALLBACK_URL_SEGMENT_SECRET')}-superfeedr-ingest"
  end
end
