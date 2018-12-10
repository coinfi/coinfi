require_relative '../batch_process'

namespace :data_migrations do
  task :populate_token_decimals_on_coins => :environment do
    coins_to_update = Coin
      .where(token_decimals: nil)
      .where.not(eth_address: nil)

    batch_process(coins_to_update) do |coin|
      PopulateTokenDecimalsForCoinWorker.new.perform(coin)

      # To ensure we stay under rate limits
      sleep 0.5
    end
  end
end
