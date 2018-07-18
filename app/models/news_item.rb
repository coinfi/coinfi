class NewsItem < ApplicationRecord
  belongs_to :feed_source
  has_one :user # References the Admin user who tagged this NewsItem
  has_one :news_item_raw
  has_many :news_coin_mentions, class_name: 'NewsCoinMention'
  has_many :coins, through: :news_coin_mentions
  has_many :news_item_categorizations, dependent: :destroy
  has_many :news_categories, through: :news_item_categorizations

  scope :categorized, -> {
    where("EXISTS(SELECT 1 FROM news_item_categorizations WHERE news_items.id = news_item_categorizations.news_item_id)")
  }
  scope :chart_data, -> { select(:url, :title, :feed_item_published_at).general.published.categorized.order_by_published }
  scope :general, -> { where(feed_source: FeedSource.general) }
  scope :pending, -> { where(is_human_tagged: nil) }
  scope :published, -> { where(is_published: true) }
  scope :tagged, -> { where(is_human_tagged: true) }
  scope :order_by_published, -> { order(feed_item_published_at: :desc) }

  alias_method :categories, :news_categories
  alias_method :mentions, :news_coin_mentions

  before_create :set_unpublished_if_feed_source_inactive, :set_unpublished_if_duplicate
  after_create_commit :notify_news_tagger, :link_coin_from_feedsource

  def coin_link_data
    coins.map { |coin| coin.as_json(only: [:symbol, :slug, :id] ) }
  end

  def coin_symbols
    coins.pluck(:symbol).join(', ')
  end

  def news_category_names
    news_categories.pluck(:name).join(', ')
  end

  def feed_source_name
    feed_source.name
  end

  private

  def set_unpublished_if_feed_source_inactive
    if !feed_source.is_active
      self.is_published = false
    end
  end

  def set_unpublished_if_duplicate
    if !self.is_published
      return
    end

    duplicate_exists = NewsItem.exists?(title: self.title)
    if duplicate_exists
      self.is_published = false
    end
  end

  def link_coin_from_feedsource
    if feed_source.coin.present?
      feed_source.coin.news_items |= [self]
    end
  end

  def notify_news_tagger
    news_tagger_endpoint = ENV['NEWS_TAGGER_ENDPOINT']
    return unless news_tagger_endpoint.present?

    auth = {
      username: ENV.fetch('NEWS_TAGGER_BASIC_AUTH_USERNAME'),
      password: ENV.fetch('NEWS_TAGGER_BASIC_AUTH_PASSWORD')
    }
    puts HTTParty.post "#{news_tagger_endpoint}/#{self.id}/assign_entities", basic_auth: auth
  end
end
