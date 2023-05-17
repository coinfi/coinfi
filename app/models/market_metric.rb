class MarketMetric < ApplicationRecord
  scope :latest, -> { order(timestamp: :desc).first }
  scope :chronologically, -> { order(timestamp: :asc) }
  scope :daily, -> (num_of_days = 30) {
    where(timestamp: MarketMetric
      .select('MAX(timestamp) as max_timestamp')
      .group('date(timestamp)')
      .order(Arel.sql('max_timestamp DESC'))
      .limit(num_of_days)
    )
    .order(Arel.sql('date(timestamp) ASC'))
  }
  scope :monthly, -> (num_of_months = 12) {
    where(timestamp: MarketMetric
      .select('MAX(timestamp) as max_timestamp')
      .group('extract(year from timestamp)', 'extract(month from timestamp)')
      .order(Arel.sql('max_timestamp DESC'))
      .limit(num_of_months)
    )
    .order(Arel.sql('date(timestamp) ASC'))
  }
end