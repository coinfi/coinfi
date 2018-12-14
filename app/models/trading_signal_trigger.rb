class TradingSignalTrigger < ApplicationRecord
  has_many :trading_signals

  validates :external_id, uniqueness: true
  validates :type_key, presence: true

  def as_dto
    {
      params: self.params,
      external_id: self.external_id,
      type_key: self.type_key,
    }.as_json
  end
end
