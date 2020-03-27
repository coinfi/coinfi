class Api::TokenMetricsController < ApiController
  before_action :set_params

  include ::TokensHelper

  def index
    start = (@page - 1) * @limit
    token_model = get_model_from_metric_type(@metric_type)

    @coins = Coin.legit.erc20_tokens.joins(token_model)
    @tokens_count = @coins.count

    if is_order_by_coin?
      @coins = @coins.sort { |a, b| a.try(@order_by) <=> b.try(@order_by) }
    else
      @coins = @coins.sort { |a, b| a.try(token_model).try(@order_by) <=> b.try(token_model).try(@order_by) }
    end
    @coins = @coins.reverse if @order == 'desc'
    @coins_page = @coins[start, @limit]

    @tokens_and_coins_data = serialize_token_metrics(@coins_page, token_model)

    respond_success index_payload
  end

  private

  ORDER_BY_PROPERTIES = ['rank', 'metric_value', 'change_1d', 'change_7d', 'change_30d', 'price', 'market_cap']

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
    if params.has_key?(:orderBy) && is_valid_order_by(params[:orderBy])
      @order_by = params[:orderBy]
    else
      @order_by = 'market_cap'
    end
    if params.has_key?(:order) && params[:order] === 'asc'
      @order = 'asc'
    else
      @order = 'desc'
    end
  end

  def index_payload
    {
      data: @tokens_and_coins_data,
      page: @page,
      limit: @limit,
      count: @tokens_count,
      metricType: @metric_type,
      metricTypeSlug: @slug,
      orderBy: @order_by,
      order: @order,
    }
  end

  def is_valid_order_by(property)
    ORDER_BY_PROPERTIES.detect { |p| p == property }.present?
  end

  def is_order_by_coin?
    @order_by == 'market_cap' || @order_by == 'price'
  end
end