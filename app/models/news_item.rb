class NewsItem < ApplicationRecord

  belongs_to :feed_source
  has_one :user # references the Admin user who tagged this NewsItem
  has_one :news_item_raw
  has_many :mentions, class_name: 'NewsCoinMention'
  has_many :coins, through: :mentions

  has_many :news_item_categorizations, dependent: :destroy
  has_many :news_categories, through: :news_item_categorizations

  default_scope -> { order(created_at: :desc) }
  scope :pending, -> { where(is_human_tagged: nil) }
  scope :tagged, -> { where(is_human_tagged: true) }

  def coin_link_data
    coins.map{ |c| c.as_json(only: [:symbol, :slug] ) }
  end

  def coin_symbols
    coins.pluck(:symbol).join(', ')
  end

  def news_category_names
    news_categories.pluck(:name).join(', ')
  end
end
