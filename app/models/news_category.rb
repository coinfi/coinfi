class NewsCategory < ApplicationRecord
  has_many :news_item_categorizations, dependent: :destroy
  has_many :news_items, through: :news_item_categorizations
  has_many :calendar_event_categorizations
  has_many :calendar_events, through: :calendar_event_categorizations

  def self.find_project_announcements!
    self.find_by!(name: 'Project Announcements')
  end
end
