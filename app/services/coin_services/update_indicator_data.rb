module CoinServices
    class UpdateIndicatorData < Patterns::Service
      include IndicatorsHelper
      include CoinsHelper
      include HealthcheckHelpers

      def initialize
        @coins = Coin.where(coin_key: INDICATOR_COIN_KEYS)
        @missing_data = []
        @healthcheck_url = ENV.fetch('HEALTHCHECK_INDICATORS')
      end

      def call
        refresh_indicators_and_signals(@coins)
        log_or_ping_on_missing_data(@missing_data, @healthcheck_url)
      end

      private

      def refresh_indicators_and_signals(coins)
        coins.each do |coin|
          price_data = coin.prices_data(force_refresh: true)

          if price_data.present?
            calculations = CalculateIndicatorsAndSignals.call(coin)
            if calculations.result.present?
              cache_indicator_data(coin, calculations.result)
            else
              @missing_data << coin.slug
            end
          else
            @missing_data << coin.slug
          end
        end
      end

      def cache_indicator_data(coin, data)
        Rails.cache.write("indicators/#{coin.slug}:data", data, expires_in: seconds_to_next_day + 1800)
      end
    end
  end