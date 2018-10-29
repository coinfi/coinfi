class StakedCofiTransaction < ApplicationRecord
  belongs_to :user, optional: true
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
    return txn_value if txn_token_decimal = 0

    padded_txn_value = txn_value.rjust(txn_token_decimal, "0")
    txn_quantity_text = padded_txn_value.insert(-1 * txn_token_decimal - 1, '.')
    BigDecimal txn_quantity_text
  end
end
