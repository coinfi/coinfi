class TokenMetricsController < ApplicationController
  before_action :set_params

  include TokensHelper

  def index
    tokens = get_all_tokens_metrics_metadata(@metric_type) || []
    @tokens_count = tokens.count
    start = (@page - 1) * @limit
    
    tokens_page = tokens[start, @limit]

    # grab associated coins
    token_coin_keys = tokens_page.map { |d| d['coin_key'] }
    coins_data = Coin.where(coin_key: token_coin_keys)

    @tokens_and_coins_data = serialize_tokens_with_coins(tokens_page, coins_data)
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
  end

  
end