module Sendy
  class Subscribe < Patterns::Service
    def initialize(email)
      @email = email
    end

    def call
      subscribe_to_sendy
    end

    def subscribe_to_sendy
      api_url = "https://sendy.coinfi.com/subscribe"

      payload = {
        api_key: ENV.fetch('SENDY_API_KEY'),
        list: ENV.fetch('SENDY_LIST_ID'),
        email: @email,
      }

      response = begin
        HTTParty.post(api_url, body: payload)
      rescue HTTParty::Error
        nil
      end
    end
  end
end