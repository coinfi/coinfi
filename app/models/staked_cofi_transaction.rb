class StakedCofiTransaction < ApplicationRecord
  belongs_to :user

  def txn_quantity
    return txn_value if txn_token_decimal = 0

    padded_txn_value = txn_value.rjust(txn_token_decimal, "0")
    txn_quantity_text = padded_txn_value.insert(-1 * txn_token_decimal - 1, '.')
    BigDecimal txn_quantity_text
  end
end
