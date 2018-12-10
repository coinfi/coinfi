require 'net/http'

class PopulateTokenDecimalsForCoinWorker
  include Sidekiq::Worker

  def perform(coin)
    log_message_prefix = "[Coin:#{coin.id}]"

    raise "#{log_message_prefix}: `token_decimals` already populated" if coin.token_decimals.present?
    raise "#{log_message_prefix}: Missing ETH address" if coin.eth_address.blank?

    # Prepare request
    uri = URI("https://api.ethplorer.io/getTokenInfo/#{coin.eth_address}")
    params = {
      apiKey: ENV.fetch('ETHPLORER_API_KEY'),
    }
    uri.query = URI.encode_www_form(params)

    # Perform request
    puts "#{log_message_prefix}: Fetching coin info from #{uri}"
    res = Net::HTTP.get_response(uri)

    # Catch any errors
    unless res.kind_of?(Net::HTTPSuccess)
      raise "Request failed with status #{res.code}: #{res.message}"
    end
    data = JSON.parse(res.body)
    if data_error = data.fetch('error', nil)
      raise "Request failed with status #{res.code}: #{data_error}"
    end

    # Parse token decimals and save to coin
    token_decimals = data.fetch('decimals').to_i
    puts "#{log_message_prefix}: Setting `token_decimals` to #{token_decimals}"
    coin.token_decimals = data.fetch('decimals').to_i
    coin.save!
  end
end
