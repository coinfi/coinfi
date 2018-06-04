class NewsItem < ApplicationRecord

  belongs_to :feed_source
  has_one :news_item_raw
  has_many :mentions, class_name: 'NewsCoinMention'
  has_many :coins, through: :mentions


  def coin_link_data
    coins.map{ |c| c.as_json(only: [:symbol, :slug] ) }
  end
end
