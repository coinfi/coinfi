class RefreshTokenMetricsViewsService < Patterns::Service
  VIEWS = [
    TokenAdoption,
    TokenDecentralization,
    TokenRetention,
    TokenSupply,
    TokenVelocity,
    DailyTokenAdoption,
    DailyTokenDecentralization,
    DailyTokenRetention,
    DailyTokenSupply,
    DailyTokenVelocity
  ]

  def initialize(concurrently: true)
    @concurrently = concurrently
  end

  def call
    refresh_views!
  end

  def refresh_views!
    VIEWS.each do |view|
      view.refresh
    end
  end
end