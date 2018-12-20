class Api::TokenMetricsController < ApiController
  before_action :set_params

  include ::TokensHelper

  def index
    tokens = get_all_tokens_metrics_metadata(@metric_type) || []
    @tokens_count = tokens.count
    start = (@page - 1) * @limit

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      if is_order_by_coin? # order by coin
        coins = Coin.legit.erc20_tokens
        coins = coins.sort { |a, b| a.public_send(@order_by) <=> b.public_send(@order_by) }
        coins = coins.reverse if @order == 'desc'
        coins_page = coins[start, @limit]

        @tokens_and_coins_data = serialize_coins_with_tokens(coins_page, tokens)
      else # order by token
        tokens = tokens.sort { |a, b| a[@order_by] <=> b[@order_by] }
        tokens = tokens.reverse if @order == 'desc'
        tokens_page = tokens[start, @limit]

        # grab associated coins
        token_coin_keys = tokens_page.map { |d| d['coin_key'] }
        coins_data = Coin.where(coin_key: token_coin_keys)

        @tokens_and_coins_data = serialize_tokens_with_coins(tokens_page, coins_data)
      end
    end

    respond_success index_payload
  end

  private

  ORDER_BY_PROPERTIES = ['rank', 'metric_value', 'change_1d', 'change_7d', 'change_30d', 'price', 'market_cap']

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
    if @order_by == 'market_cap' || @order_by == 'price'
      return true
    end
    return false
  end
end