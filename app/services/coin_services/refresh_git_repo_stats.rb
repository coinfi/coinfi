require_relative '../../../lib/tasks/batch_process'

module CoinServices
  class RefreshGitRepoStats < Patterns::Service
    attr_reader :failed_updates
    include HealthcheckHelpers
    INDICATOR_COIN_KEYS = ::IndicatorsHelper::INDICATOR_COIN_KEYS
    MAX_RETRIES = 5

    def initialize(coin_keys: INDICATOR_COIN_KEYS)
      @coin_keys = coin_keys
      @coins = Coin.where(coin_key: @coin_keys)
      @failed_updates = []
      @healthcheck_url = ENV.fetch('HEALTHCHECK_INDICATORS')
    end

    def call
      refresh_git_stats(@coins)
      log_or_ping_on_missing_data(@failed_updates, @healthcheck_url)
    end

    private

    def refresh_git_stats(coins)
      failure_coin_ids = nil
      retries = 0

      loop do
        failure_coin_ids = retrieve_coin_stats(coins)

        break if failure_coin_ids.blank?
        break if retries >= MAX_RETRIES

        retries += 1
        coins = Coin.where(id: failure_coin_ids)
      end

      if failure_coin_ids.present?
        @failed_updates += failure_coin_ids
      end
    end

    def retrieve_coin_stats(coins)
      batch_process(coins) do |coin|
        next unless coin.has_git_repo?
        result = coin.git_stats(force_refresh: true)
        if result.blank?
          raise StandardError, "No results for #{coin.slug}"
        end
      end
    end
  end
end