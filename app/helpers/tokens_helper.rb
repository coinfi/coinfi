module TokensHelper
  METRIC_TYPES = ['exchange_supply', 'token_retention_rate', 'unique_wallet_count', 'token_distribution_100', 'token_velocity']

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
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/#{metric_type}_metrics_view?order=rank.asc"
      response = HTTParty.get(url)
      results = JSON.parse(response.body)
      results.empty? ? nil : results
    end
  end

  def is_valid_metric_type(metric_type)
    METRIC_TYPES.detect { |t| t == metric_type }.present?
  end

  def default_metric_type
    METRIC_TYPES.first
  end
end