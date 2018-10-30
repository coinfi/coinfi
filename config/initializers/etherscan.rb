Etherscan.configure do |config|
  config.key = ENV.fetch('ETHERSCAN_API_KEY')
end
