module CoinServices
  class CalculateGitRepoRankings < Patterns::Service
    attr_reader :failed_to_rank
    include HealthcheckHelpers
    INDICATOR_COIN_KEYS = ::IndicatorsHelper::INDICATOR_COIN_KEYS
    STATS_TO_RANK = [:watchers, :stargazers, :forks, :contributors]

    def initialize()
      @coins = Coin.with_git_repo.where(coin_key: INDICATOR_COIN_KEYS)
      @snapshots = []
      @ranked_snapshots = {}
      @failed_to_rank = []
      @healthcheck_url = ENV.fetch('HEALTHCHECK_INDICATORS')
    end

    def call
      get_git_stats
      calculate_git_rankings
      store_git_rankings
      log_or_ping_on_missing_data(@failed_to_rank, @healthcheck_url)
    end

    private

    def get_git_stats
      @coins.each do |coin|
        results = coin.git_stats
        if results.present? && results.has_key?(:snapshot)
          @snapshots << results[:snapshot].merge({id: coin.id})
        else
          @failed_to_rank << coin.id
        end
      end
    end

    def calculate_git_rankings
      STATS_TO_RANK.each do |stat_name|
        unsorted_data = @snapshots.collect { |item| [item[:id], item[stat_name]] }
        sorted_data = unsorted_data.sort { |a, b| b[1] <=> a[1] } # all stats are ranked in descending order
        ranking_data = sorted_data.map.with_index(1) { |item, index| [item[0], index] }
        @ranked_snapshots[stat_name] = ranking_data.to_h
      end
    end

    def store_git_rankings
      @coins.each do |coin|
        next if @failed_to_rank.include?(coin.id)
        coin_ranked_data = {}
        STATS_TO_RANK.each do |stat_name|
          ranking_data = @ranked_snapshots[stat_name]
          coin_ranked_data["#{stat_name}_rank".to_sym] = ranking_data[coin.id]
          coin_ranked_data["#{stat_name}_total".to_sym] = ranking_data.length
        end
        coin.merge_git_stats({snapshot: coin_ranked_data})
      end
    end
  end
end