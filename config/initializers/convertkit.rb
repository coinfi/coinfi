Convertkit.configure do |config|
  config.api_secret = ENV.fetch("CONVERTKIT_API_SECRET")
  config.api_key = ENV.fetch("CONVERTKIT_API_KEY")
end
