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
        check_result(result, coin.slug)
      end

      @failed_updates += failures
    end

    def check_result(result, coin_slug)
      if result.blank?
        raise StandardError, "No results for #{coin_slug}"
      elsif result[:commit_activity].blank?
        raise StandardError, "No commit activity for #{coin_slug}"
      elsif result[:code_frequency].blank?
        raise StandardError, "No code frequency for #{coin_slug}"
      elsif result[:snapshot].blank?
        raise StandardError, "No snapshot for #{coin_slug}"
      elsif !has_stats?(result[:snapshot])
        raise StandardError, "Incomplete snapshot for #{coin_slug}"
      end
    end

    def has_stats?(snapshot)
      if snapshot[:watchers].blank?
        false
      elsif snapshot[:stargazers].blank?
        false
      elsif snapshot[:forks].blank?
        false
      elsif snapshot[:contributors].blank?
        false
      else
        true
      end
    end
  end
end