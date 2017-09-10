class Article < ApplicationRecord
  acts_as_taggable

  belongs_to :coin

  scope :chart_data, -> { select(:url, :title, :published_epoch).order(:published_date) }

  before_save :sync_published_date_to_epoch

  def sync_published_date_to_epoch
    # Use JS epoch for convenience.
    self.published_epoch = self.published_date.to_f * 1000 if self.published_date_changed?
  end
end
