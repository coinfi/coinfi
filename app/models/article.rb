class Article < ApplicationRecord
  acts_as_taggable

  belongs_to :coin

  before_save :sync_published_date_to_epoch

  scope :importancy,       -> (score) { where('importance >= ?', score) }
  scope :chart_data,      -> { select(:url, :title, :published_epoch).order(:published_date) }
  scope :latest_news,     -> { where('published_date <= ?', Time.now).order(published_date: :desc) }
  scope :upcoming_events, -> { where('published_date > ?', Time.now).order(published_date: :asc) }

  def sync_published_date_to_epoch
    # Use JS epoch for convenience.
    self.published_epoch = self.published_date.to_f * 1000 if self.published_date_changed?
  end
end
