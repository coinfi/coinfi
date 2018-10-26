class StakedCofiTransaction < ApplicationRecord
  belongs_to :user

  def txn_quantity
    quantity_text = txn_value.insert(-1 * txn_token_decimal - 1, '.')
    BigDecimal quantity_text
  end
end
