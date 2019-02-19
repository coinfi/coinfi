require_relative '../../../lib/tasks/batch_process'

module CoinMarketCapPro
  class UpdateExchangesService < Patterns::Service
    include CoinMarketCapProHelpers
    attr_reader :cmc_missing_data

    def initialize
      @healthcheck_url = ENV.fetch('HEALTHCHECK_EXCHANGES')
      @cmc_missing_data = []
      @updated_records = []
    end

    def call
      active_mapping = fetch_exchange_mapping_data

      if active_mapping.present?
        ids = extract_ids_from_mapping(active_mapping)
        metadata = get_metadata_using_ids(ids)
        inactive_mapping = fetch_exchange_mapping_data(active: false)
        mapping = active_mapping + inactive_mapping

        update_exchanges(mapping, metadata)
        log_or_ping_on_missing_data(@cmc_missing_data, @healthcheck_url)
      end

      @updated_records
    end

    private

    def update_exchanges(mapping, metadata)
      batch_process(mapping) do |exchange|
        cmc_id = exchange["id"]
        data = metadata["#{cmc_id}"] # cmc_id is a number

        # easier to just build all params and then remove missing ones
        update = {
          cmc_id: cmc_id,
          name: exchange["name"],
          slug: exchange["slug"],
          is_active: exchange["is_active"],

        }
        if data.present?
          update.merge!({
            www_url: data.dig("urls", "website", 0),
            twitter_url: data.dig("urls", "twitter", 0),
            blog_url: data.dig("urls", "blog", 0),
            chat_url: data.dig("urls", "chat", 0),
            fee_url: data.dig("urls", "fee", 0),
            logo_url: data.dig("logo"),
          })
        end
        update = update.delete_if { |k, v| v.nil? }

        unless update.empty?
          @updated_records << CmcExchange.upsert(update)
        end
      end
    end

    def get_metadata_using_ids(ids)
      # Call in batches of 100 (i.e., max # exchanges / 1 credit)
      # We don't call all ids at once because it can max out query param
      # Might need to implement throttling to avoid too many API calls at once
      metadata = {}
      ids.each_slice(100) do |id_batch|
        metadata_slice = fetch_exchange_meta_data(id_batch)
        if metadata_slice.present?
          metadata.merge!(metadata_slice)
        else
          @cmc_missing_data.concat(id_batch)
        end
      end

      metadata
    end

    def extract_ids_from_mapping(mapping)
      mapping.map { |exchange| exchange["id"] }
    end

    def fetch_exchange_mapping_data(active: true)
      api_url = "https://pro-api.coinmarketcap.com/v1/exchange/map"
      query = { :listing_status => active ? 'active' : 'inactive' }
      headers = get_default_api_headers
      response = begin
        HTTParty.get(api_url, :query => query, :headers => headers)
      rescue HTTParty::Error
        nil
      end

      # only ping healthcheck regarding active mapping
      extract_api_data(response, active ? @healthcheck_url : nil)
    end

    def fetch_exchange_meta_data(ids)
      api_url = "https://pro-api.coinmarketcap.com/v1/exchange/info"
      id_list = ids.respond_to?(:join) ? ids.join(',') : ids
      query = { :id => id_list }
      headers = get_default_api_headers

      response = begin
        HTTParty.get(api_url, :query => query, :headers => headers)
      rescue HTTParty::Error
        nil
      end

      # don't ping hc at this point since we will try to complete
      # as many other responses as possible
      extract_api_data(response)
    end
  end
end