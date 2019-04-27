require_relative '../../../lib/tasks/batch_process'

module CoinServices
  class RefreshGithubStats < Patterns::Service
    attr_reader :failed_updates
    include HealthcheckHelpers
    INDICATOR_COIN_KEYS = ::IndicatorsHelper::INDICATOR_COIN_KEYS

    def initialize()
      @coins = Coin.where(coin_key: INDICATOR_COIN_KEYS)
      @failed_updates = []
      @healthcheck_url = ENV.fetch('HEALTHCHECK_GITHUB')
    end

    def call
      refresh_github_stats(@coins)
      log_or_ping_on_missing_data(@failed_updates, @healthcheck_url)
    end

    private

    def refresh_github_stats(coins)
      failures = batch_process(coins) do |coin|
        result = coin.github_stats(force_refresh: true)
        if result.nil? || result.empty?
          raise StandardError, "No results for #{coin.slug}"
        end
      end

      @failed_updates += failures
    end
  end
end