class ExchangeListing < ApplicationRecord
  belongs_to :exchange
  # Disabling temporarily since we don't map quote_symbol or base_symbol to Coin#id yet.
  #belongs_to :quote_coin, class_name: 'Coin', foreign_key: 'quote_symbol_id'
  #belongs_to :base_coin, class_name: 'Coin', foreign_key: 'base_symbol_id'

  scope :centralized, -> { where.not(ccxt_exchange_id: ['coinmarketcap', 'idex', 'etherdelta', 'forkdelta']) }
  scope :order_by_detected, -> { order(detected_at: :desc) }

  def exchange_id
    exchange.id
  end

  def exchange_name
    exchange.name
  end

  def headline
    coin_name = quote_coin.try(:name) || Coin.listed.legit.find_by_symbol(quote_symbol).try(:name) || ''
    retval = "Exchange Listing: #{coin_name} "
    coin_name.present? ? retval << "(#{quote_symbol})" : retval << quote_symbol
    retval << " listed on #{exchange_name}"
    retval
  end
end
