class FeedSource < ApplicationRecord
  SUPERFEEDR_API_URL = 'https://push.superfeedr.com/'.freeze
  SUPERFEEDR_AUTH = { username: ENV.fetch('SUPERFEEDR_USER'), password: ENV.fetch('SUPERFEEDR_TOKEN') }.freeze
  SUPERFEEDR_RETRIEVE_BATCH_SIZE = 50.freeze

  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  belongs_to :coin, optional: true
  has_many :news_items

  scope :active, -> { where(is_active: true) }

  def self.types
    pluck(:feed_type).uniq.compact.reject { |t| t.length < 1 }
  end

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

  def retrieve!
    items = retrieve
    items.map!{|item| HashWithIndifferentAccess.new(item)} #since ingest is using symbols to access the hash
    items.each{|item| NewsItemRaw.ingest!(item, slug)}
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

    HTTParty.post(SUPERFEEDR_API_URL, options)

    #if the line above fails it throws an error so if we got here
    #we can assume this one has subscribed sucessfully
    update(is_subscribed: true)
  end

  def callback_url
    "#{self.class.callback_url_base}?source=#{slug}"
  end

  def self.callback_url_base
    protocol = Rails.env.development? ? 'http://' : 'https://'

    "#{protocol}#{ENV.fetch('ROOT_DOMAIN')}/webhooks/#{ENV.fetch('SUPERFEEDR_CALLBACK_URL_SEGMENT_SECRET')}-superfeedr-ingest"
  end

  SUPERFEEDR_MAX_PER_PAGE = 500
  def self.fetch_subs(page = 1)
    #TODO change this now that we have > 500 subscriptions
    body = {
      'hub.mode' => 'list', 
      'by_page' => SUPERFEEDR_MAX_PER_PAGE, # This is the max supported by SuperFeedr
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
      break if new_subs.size < SUPERFEEDR_MAX_PER_PAGE
    end

    subs
  end

  def self.ids_without_subs
    all_subs = fetch_all_subs
    fs_ids_missing_subs = []
    FeedSource.active.find_each do |fs|
      fs_ids_missing_subs << fs.id unless all_subs.any?{|sub| sub["feed"]["url"] == fs.feed_url and sub["endpoint"] == fs.callback_url}
    end
    fs_ids_missing_subs
  end

  def subscribed?
    query = {
      'hub.mode' => 'list', 
      'search[feed][url]' => feed_url, 
      'format' => 'json', 
    }

    options = {
      basic_auth: { username: ENV.fetch('SUPERFEEDR_USER'), password: ENV.fetch('SUPERFEEDR_TOKEN') },
      query: query
    }

    #debug_url = "http://tester123.proxy.beeceptor.com"
    subs_with_this_feed_url = HTTParty.get(SUPERFEEDR_API_URL, options)
    #subs_with_this_feed_url = HTTParty.get(debug_url, options)
    subs_with_this_feed_url.any?{|sub| sub["subscription"]["endpoint"] == callback_url}
  end
end
