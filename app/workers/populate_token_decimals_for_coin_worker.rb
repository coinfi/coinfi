require 'net/http'

class PopulateTokenDecimalsForCoinWorker
  include Sidekiq::Worker

  def perform(coin, trace: false)
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
    puts "#{log_message_prefix}: Fetching coin info from #{uri}" if trace
    res = Net::HTTP.get_response(uri)

    # Catch any errors
    unless res.kind_of?(Net::HTTPSuccess)
      raise "Request failed with status #{res.code}: #{res.message}"
    end
    data = JSON.parse(res.body)
    if data_error = data.fetch('error', nil)
      raise "Request failed with status #{res.code}: #{data_error}"
    end

    # Parse token decimals
    token_decimals_raw = data.fetch('decimals')
    token_decimals = token_decimals_raw.to_i
    if token_decimals.to_s != token_decimals_raw.to_s
      raise "`decimals` attribute is not an integer"
    end

    # Save to coin
    puts "#{log_message_prefix}: Setting `token_decimals` to #{token_decimals}" if trace
    coin.token_decimals = token_decimals
    coin.save!
  end
end
