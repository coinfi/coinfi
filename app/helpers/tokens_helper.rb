module TokensHelper
  METRIC_TYPES = [
    {
      value: 'exchange_supply',
      slug: 'supply-on-exchange',
    },
    {
      value: 'token_retention_rate',
      slug: 'retention',
    },
    {
      value: 'token_distribution_100',
      slug: 'decentralization',
    },
    {
      value: 'unique_wallet_count',
      slug: 'adoption',
    },
    {
      value: 'token_velocity',
      slug: 'velocity',
    },
  ]

  def get_token_metrics_metadata(coin_key, metric_type)
    metric_metadata = get_all_tokens_metrics_metadata(metric_type) || []
    metric_metadata.detect { |d| d['coin_key'] == coin_key }
  end

  def get_all_tokens_metrics_metadata(metric_type)
    return nil unless is_valid_metric_type(metric_type)

    Rails.cache.fetch(
      "tokens/#{metric_type}_metadata",
      expires_at: 1.day.since.beginning_of_day + 4 hours, # 1 hour after metrics are processed
      race_condition_ttl: 10.seconds
    ) do
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/#{metric_type}_metadata_view?order=rank.asc"
      response = HTTParty.get(url)
      results = JSON.parse(response.body)
      if results.present? and results.is_a?(Array)
        results
      else
        nil
      end
    end
  end

  def is_valid_metric_type(metric_type)
    METRIC_TYPES.detect { |t| t[:value] == metric_type }.present?
  end

  def is_valid_metric_type_slug(metric_type_slug)
    METRIC_TYPES.detect { |t| t[:slug] == metric_type_slug }.present?
  end

  def default_metric_type
    METRIC_TYPES.first[:value]
  end

  def get_metric_type_from_slug(slug)
    metric_type_hash = METRIC_TYPES.detect { |t| t[:slug] == slug }

    if metric_type_hash.present?
      metric_type_hash[:value]
    else
      METRIC_TYPES[0][:value]
    end
  end

  def get_slug_from_metric_type(metric_type)
    metric_type_hash = METRIC_TYPES.detect { |t| t[:value] == metric_type }

    if metric_type_hash.present?
      metric_type_hash[:slug]
    else
      METRIC_TYPES[0][:slug]
    end
  end

  def serialize_tokens_with_coins(tokens, coins)
    tokens.map do |token|
      coin = coins.detect { |c| c.coin_key == token['coin_key'] }

      token_hash = {
        coin_key: token['coin_key'],
        rank: token['rank'],
        metric_value: token['metric_value'],
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

  def serialize_coins_with_tokens(coins, tokens)
    coins.map do |coin|
      token = tokens.detect { |t| coin.coin_key == t['coin_key'] }

      coin_hash = {
        id: coin.id,
        coin_key: coin.coin_key,
        name: coin.name,
        image_url: coin.image_url,
        symbol: coin.symbol,
        slug: coin.slug,
        price: coin.price,
        market_cap: coin.market_cap,
      }

      if token.present?
        coin_hash = coin_hash.merge({
          rank: token['rank'],
          metric_value: token['metric_value'],
          change_1d: token['change_1d'],
          change_7d: token['change_7d'],
          change_30d: token['change_30d'],
        })
      end

      coin_hash
    end
  end
end