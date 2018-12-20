class TokenMetricsController < ApplicationController
  before_action :set_params

  include TokensHelper

  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      tokens = get_all_tokens_metrics_metadata(@metric_type) || []
      @tokens_count = tokens.count
      start = (@page - 1) * @limit

      coins = Coin.legit.erc20_tokens
      coins = coins.sort { |a, b| a.market_cap <=> b.market_cap }
      coins = coins.reverse
      coins_page = coins[start, @limit]

      @tokens_and_coins_data = serialize_coins_with_tokens(coins_page, tokens)
    end
  end

  private

  def set_params
    @page = if params.has_key?(:page) then params[:page].to_i else 1 end
    @limit = if params.has_key?(:limit) then params[:limit].to_i else 100 end
    if params.has_key?(:metric_type_slug) && is_valid_metric_type_slug(params[:metric_type_slug])
      @slug = params[:metric_type_slug]
      @metric_type = get_metric_type_from_slug(@slug)
    else
      @metric_type = default_metric_type
      @slug = get_slug_from_metric_type(@metric_type)
    end

    if !params.has_key?(:metric_type_slug)
      redirect_to action: action_name, metric_type_slug: @slug, status: :moved_permanently
    elsif params[:metric_type_slug] != @slug
      render_404
    end
  end


end