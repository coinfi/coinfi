class CalendarEvent < ApplicationRecord
  has_one :user
  has_many :calendar_event_coins, dependent: :destroy
  has_many :coins, through: :calendar_event_coins
  has_many :calendar_event_categorizations, dependent: :destroy
  has_many :news_categories, through: :calendar_event_categorizations

  alias_method :categories, :news_categories

  def coin_link_data
    coins.map { |coin| coin.as_json(only: [:symbol, :slug, :id] ) }
  end

  def coin_symbols
    coins.pluck(:symbol).join(', ')
  end

  def news_category_names
    news_categories.pluck(:name).join(', ')
  end
end