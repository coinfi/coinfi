module CoinServices
  class UpdateIndicatorStats < Patterns::Service
    include IndicatorsHelper
    include HealthcheckHelpers

    def initialize
      @coins = Coin.where(coin_key: INDICATOR_COIN_KEYS)
      @missing_data = []
      @healthcheck_url = ENV.fetch('HEALTHCHECK_INDICATORS')
    end

    def call
      results_coin_hash = {}
      snapshot = fetch_snapshot

      if snapshot.present?
        @coins.each do |coin|
          coin_stats = snapshot[coin.coin_key]

          if coin_stats.present?
            cache_coin_stats(coin, coin_stats)
            coin.touch
            results_coin_hash[coin.slug] = coin_stats
          else
            @missing_data << coin.slug
          end
        end
      else
        @missing_data += @coins.map {|coin| coin.slug}
      end

      log_or_ping_on_missing_data(@missing_data, @healthcheck_url)
      results_coin_hash
    end

    private

    def cache_coin_stats(coin, stats)
      Rails.cache.write("indicators/#{coin.slug}:stats", stats)
    end

    def fetch_snapshot
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/indicators_snapshot"
      response = begin
        HTTParty.get(url)
      rescue HTTParty::Error
        nil
      end

      process_snapshot_response(response)
    end

    def process_snapshot_response(response)
      if response.blank? || !response.success?
        healthcheck_or_log_error('No API response found.', @healthcheck_url)
        return nil
      end

      contents = JSON.parse(response.body)

      snapshot_hash = {}
      contents.each do |coin|
        coin_key = coin.dig('coin_key')

        if coin_key.present?
          snapshot_hash[coin_key] = coin
        end
      end

      snapshot_hash
    end
  end
end