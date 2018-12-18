module TokensHelper
  METRIC_TYPES = [
    {
      value: 'exchange_supply',
      slug: 'exchange-supply',
    },
    {
      value: 'token_retention_rate',
      slug: 'token-retention',
    },
    {
      value: 'token_distribution_100',
      slug: 'token-distribution',
    },
    {
      value: 'unique_wallet_count',
      slug: 'unique-wallet',
    },
    {
      value: 'token_velocity',
      slug: 'token-velocity',
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
      expires_in: 1.day,
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
end