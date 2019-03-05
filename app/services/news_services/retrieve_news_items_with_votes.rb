module NewsServices
  class RetrieveNewsItemsWithVotes < Patterns::Service
    include NewsVoteHelper
    attr_reader :json_news_items

    def initialize(json_news_items: nil, user: nil)
      @json_news_items = json_news_items
      @user = user
    end

    def call
      if @json_news_items.blank?
        return
      end

      distribute_reads(max_lag: ::ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        news_item_ids = get_news_ids
        vote_summary_hash = convert_active_records_to_id_indexed_hash(
            NewsItemVote.where(news_item_id: news_item_ids)
          )
        user_vote_hash = {}
        if @user.present?
          user_vote_hash = convert_active_records_to_id_indexed_hash(
              NewsVote.where(user: @user).where(news_item_id: news_item_ids)
            )
        end

        add_vote_data = Proc.new do |item, *args|
          news_item_id = item['id']
          vote_summary = vote_summary_hash.dig(news_item_id) || default_vote_summary(news_item_id)
          vote = user_vote_hash.dig(news_item_id)
          item.merge({ votes: serialize_vote_summary(vote_summary, vote) })
        end

        # Handle both json hashes and arrays of json hashes
        if (@json_news_items.kind_of?(Array))
          @json_news_items.map(&add_vote_data)
        else
          add_vote_data.call(@json_news_items)
        end
      end
    end

    private

    def get_news_ids
      if @json_news_items.kind_of?(Array)
        @json_news_items.map {|item| item['id']}
      else
        [@json_news_items.dig('id')]
      end
    end

    def default_vote_summary(news_item_id)
      { id: news_item_id, total: 0 }
    end

    def convert_active_records_to_id_indexed_hash(records)
      records.reduce({}) do |hash, record|

        hash.merge(Hash[record.id, record])
      end
    end
  end
end