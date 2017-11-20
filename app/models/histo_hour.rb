# Hourly data from CryptoCompare
class HistoHour < ApplicationRecord
  validates :time, uniqueness: true

  def self.volume_difference(from_symbol, to_symbol)
    results = HistoHour.where(from_symbol: from_symbol, to_symbol: to_symbol).order(time: :desc).limit(2)
    before = results.first
    after = results.last
    [before.volume_from, after.volume_from]
  end
end
