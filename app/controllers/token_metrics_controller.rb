class TokenMetricsController < ApplicationController
  before_action :set_params, :set_exchange_rates

  include TokensHelper
  include CurrencyHelper

  def index
    start = (@page - 1) * @limit
    token_model = get_model_from_metric_type(@metric_type)

    @coins = Coin.legit.erc20_tokens.joins(token_model)
    @tokens_count = @coins.count

    @coins = @coins.sort { |a, b| a.market_cap <=> b.market_cap }
    @coins = @coins.reverse
    @coins_page = @coins[start, @limit]

    @tokens_and_coins_data = serialize_token_metrics(@coins_page, token_model)
  end

  private

  def set_params
    @page = params[:page]&.to_i || 1
    @limit = params[:limit]&.to_i || 100
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