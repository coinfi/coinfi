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
    @metric_type = params[:metric_type].present? ? get_metric_type_from_slug(params[:metric_type]) : default_metric_type
    @metric_type_slug = get_slug_from_metric_type(@metric_type)
  end

  def index_serialize(tokens, coins)
    tokens.map do |token|
      coin = coins.detect { |c| c.coin_key == token['coin_key'] }

      token_hash = {
        coin_key: token['coin_key'],
        rank: token['rank'],
        token_metric: token['metric_value'],
        change_1d: token['change_1d'],
        change_7d: token['change_7d'],
        change_30d: token['change_30d'],
      }

      if coin.present?
        token_hash = token_hash.merge({
          id: coin.id,
          coin_key: coin.coin_key,
          name: coin.name,
          image_url: coin.image_url,
          symbol: coin.symbol,
          slug: coin.slug,
          price: coin.price,
          market_cap: coin.market_cap,
        })
      end

      token_hash
    end
  end
end