class DailyOhclPrice < ApplicationRecord
  belongs_to :coin

  scope :usd, -> { where(to_currency: 'USD') }
  scope :chronological, -> { order(time: :asc) }
  scope :reverse_chronological, -> { order(time: :desc) }

  def as_json
    {
      'coin_key' => coin.coin_key,
      'to_currency' => to_currency,
      'time' => time.strftime("%FT%T"),
      'open' => open,
      'high' => high,
      'low' => low,
      'close' => close,
      'volume_to' => volume_to
    }
  end
end