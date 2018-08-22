require_relative 'batch_process'

# This task gets run locally, pointing to the correct CSV URL and database environment.
namespace :listings do
  task :import_from_csv => :environment do
    CSV.foreach('/path/to/csv', headers: true).with_index do |row, index|
      puts "Processing line #{index}..."
      puts row

      ccxt_exchange_id = row['exchange'].strip

      # Fix idax -> idex misspelling.
      ccxt_exchange_id = 'idex' if ccxt_exchange_id == 'idax'

      # Skip EtherDelta and ForkDelta listings.
      next if ccxt_exchange_id == 'etherdelta'
      next if ccxt_exchange_id == 'forkdelta'

      exchange = Exchange.find_by!(ccxt_id: ccxt_exchange_id)
      symbol = row['pair'].strip

      # Skip BitMex futures.
      next if ccxt_exchange_id == 'bitmex' && !symbol.include?('/')

      # Skip BitFlyer futures.
      next if ccxt_exchange_id == 'bitflyer' && !symbol.include?('/')

      delimiter = '/'
      if ccxt_exchange_id == 'okex'
        delimiter = '_'
      end
      quote_symbol = symbol.split(delimiter).first
      base_symbol = symbol.split(delimiter).last

      # The current IDEX implementation has the quote and base symbols reversed
      # and with a different format of BASE_QUOTE instead of QUOTE/BASE.
      # Also keep in mind the incorrect spelling (idax [sic] vs idex).
      if ccxt_exchange_id == 'idex' && symbol.include?('_')
        symbol_array = symbol.split('_')
        base_symbol = symbol_array.first
        quote_symbol = symbol_array.last
        symbol = "#{quote_symbol}/#{base_symbol}"
      end

      detected_at = row['timestamp'].strip.to_datetime

      begin
        listing = ExchangeListing.create!(
          exchange: exchange,
          ccxt_exchange_id: exchange.ccxt_id,
          symbol: symbol,
          quote_symbol: quote_symbol,
          base_symbol: base_symbol,
          detected_at: detected_at,
        )
      rescue ActiveRecord::RecordNotUnique => exception
        puts exception
      end

      puts listing
    end
  end
end
