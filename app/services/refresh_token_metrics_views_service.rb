class RefreshTokenMetricsViewsService < Patterns::Service
  VIEWS = [
    'exchange_supply_view',
    'token_retention_rate_view',
    'unique_wallet_count_view',
    'token_distribution_100_view',
    'token_velocity_view',
    'metrics_chart_view'
  ]

  def initialize(concurrently: true)
    @connection = ActiveRecord::Base.connection
    @concurrently = concurrently
  end

  def call
    refresh_views!
  end

  def refresh_views!
    VIEWS.each do |view|
      @connection.execute <<-SQL
        REFRESH MATERIALIZED VIEW #{'CONCURRENTLY' if @concurrently} #{view} WITH DATA;
      SQL
    end
  end
end