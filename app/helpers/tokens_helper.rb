module TokensHelper
  # order-specific; look-ups default to index 0 if no matches
  METRIC_TYPES = [
    {
      value: 'exchange_supply',
      slug: 'supply-on-exchange',
      model: :token_supply,
    },
    {
      value: 'token_retention_rate',
      slug: 'retention',
      model: :token_retention,
    },
    {
      value: 'token_distribution_100',
      slug: 'decentralization',
      model: :token_decentralization,
    },
    {
      value: 'unique_wallet_count',
      slug: 'adoption',
      model: :token_adoption,
    },
    {
      value: 'token_velocity',
      slug: 'velocity',
      model: :token_velocity,
    },
  ]

  def is_valid_metric_type(metric_type)
    METRIC_TYPES.detect { |t| t[:value] == metric_type }.present?
  end

  def is_valid_metric_type_slug(metric_type_slug)
    METRIC_TYPES.detect { |t| t[:slug] == metric_type_slug }.present?
  end

  def default_metric_type
    METRIC_TYPES.first[:value]
  end

  def get_model_from_metric_type(metric_type)
    metric_type_hash = METRIC_TYPES.detect { |t| t[:value] == metric_type }

    if metric_type_hash.present?
      metric_type_hash[:model]
    else
      METRIC_TYPES[0][:model]
    end
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

  def serialize_token_metrics(coins, token_model)
    coins.map do |coin|
      {
        id: coin.id,
        coin_key: coin.coin_key,
        name: coin.name,
        image_url: coin.image_url,
        symbol: coin.symbol,
        slug: coin.slug,
        price: coin.price,
        market_cap: coin.market_cap,
        rank: coin.try(token_model).try(:rank),
        metric_value: coin.try(token_model).try(:metric_value),
        change_1d: coin.try(token_model).try(:change_1d),
        change_7d: coin.try(token_model).try(:change_7d),
        change_30d: coin.try(token_model).try(:change_30d),
      }
    end
  end
end