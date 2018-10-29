class StakedCofiTransaction < ApplicationRecord
  belongs_to :user, optional: true
  scope :unconfirmed, -> { where(is_txn_confirmations_gte_10: false) }
  scope :confirmed, -> { where(is_txn_confirmations_gte_10: true) }

  # Only set the user if its not defined to avoid replacing any manual overrides
  before_save :set_user_by_txn_from, :if => proc { |f| f.user.blank? && f.txn_from_changed? }

  def set_user_by_txn_from
    if self.txn_from.blank?
      self.user = nil
      return
    end

    self.user = User.find_by("(token_sale->>'staked_ethereum_address') = ?", self.txn_from)
  end

  def txn_quantity
    return BigDecimal(self.txn_value) if self.txn_token_decimal == 0

    padded_txn_value = self.txn_value.rjust(self.txn_token_decimal, "0")
    txn_quantity_text = padded_txn_value.insert(-1 * self.txn_token_decimal - 1, '.')
    BigDecimal txn_quantity_text
  end
end
