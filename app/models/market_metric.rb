class MarketMetric < ApplicationRecord
  scope :latest, -> { order(timestamp: :desc).first }
  scope :chronologically, -> { order(timestamp: :asc) }
  scope :daily, -> (num_of_days = 30) {
    where(timestamp: MarketMetric
      .select('MAX(timestamp) as max_timestamp')
      .where('timestamp >= ?', num_of_days.days.ago.beginning_of_day)
      .group('date(timestamp)')
      .order('max_timestamp DESC')
      .limit(num_of_days)
    )
  }
  scope :monthly, -> (num_of_months = 12) {
    where(timestamp: MarketMetric
      .select('MAX(timestamp) as max_timestamp')
      .where('timestamp >= ?', num_of_months.months.ago.beginning_of_day)
      .group('extract(year from timestamp)', 'extract(month from timestamp)')
      .order('max_timestamp DESC')
      .limit(num_of_months)
    )
  }
end