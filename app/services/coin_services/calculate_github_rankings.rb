module CoinServices
  class CalculateGithubRankings < Patterns::Service
    INDICATOR_COIN_KEYS = ::IndicatorsHelper::INDICATOR_COIN_KEYS
    STATS_TO_RANK = [:watchers, :stargazers, :forks, :contributors]

    def initialize()
      @coins = Coin.where(coin_key: INDICATOR_COIN_KEYS)
      @snapshots = []
      @ranked_snapshots = {}
    end

    def call
      get_github_stats
      calculate_github_rankings
      store_github_rankings
    end

    private

    def get_github_stats
      @coins.each do |coin|
        results = coin.github_stats
        if results.present?
          @snapshots << results[:snapshot].merge({id: coin.id})
        end
      end
    end

    def calculate_github_rankings
      STATS_TO_RANK.each do |stat_name|
        unsorted_data = @snapshots.collect { |item| [item[:id], item[stat_name]] }
        sorted_data = unsorted_data.sort { |a, b| b[1] <=> a[1] } # all stats are ranked in descending order
        ranking_data = sorted_data.map.with_index(1) { |item, index| [item[0], index] }
        @ranked_snapshots[stat_name] = ranking_data.to_h
      end
    end

    def store_github_rankings
      @coins.each do |coin|
        coin_ranked_data = {}
        STATS_TO_RANK.each do |stat_name|
          ranking_data = @ranked_snapshots[stat_name]
          coin_ranked_data["#{stat_name}_rank".to_sym] = ranking_data[coin.id]
          coin_ranked_data["#{stat_name}_total".to_sym] = ranking_data.length
        end
        coin.merge_github_stats({snapshot: coin_ranked_data})
      end
    end
  end
end