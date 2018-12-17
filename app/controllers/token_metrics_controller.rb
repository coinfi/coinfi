class TokenMetricsController < ApplicationController
  before_action :set_metric_type

  include TokensHelper

  def index
    @page = if params.has_key?(:page) then params[:page].to_i else 1 end
    @limit = if params.has_key?(:limit) then params[:limit].to_i else 100 end

    tokens = get_all_tokens_metrics_metadata(@metric_type) || []
    @tokens_count = tokens.count

    # get page data
    start = (@page - 1) * @limit
    tokens_data = tokens[start, @limit]

    # grab associated coins
    token_coin_keys = tokens_data.map { |d| d['coin_key'] }
    coins_data = Coin.where(coin_key: token_coin_keys)

    @tokens_and_coins_data = index_serialize(tokens_data, coins_data)
  end

  private

  def set_metric_type
    # TODO: convert from desired slugs to internally used metric types
    metric_type = params[:metric_type].gsub!('-', '_') if params[:metric_type].present?
    @metric_type = is_valid_metric_type(metric_type) ? metric_type : default_metric_type
  end

  def index_serialize(tokens, coins)
    tokens.map do |token|
      coin = coins.detect { |c| c.coin_key == token['coin_key'] }

      {
        id: coin.id,
        coin_key: coin.coin_key,
        name: coin.name,
        image_url: coin.image_url,
        symbol: coin.symbol,
        slug: coin.slug,
        price: coin.price,
        market_cap: coin.market_cap,
        change1h: coin.change1h,
        change24h: coin.change24h,
        change7d: coin.change7d,
        volume24h: coin.volume24h,
        rank: token['rank'],
        token_metric: token['metric_value'],
      }
    end
  end
end