module NewsServices
  class RetrieveNewsItemsWithVotes < Patterns::Service
    include NewsHelper
    attr_reader :json_news_items

    def initialize(json_news_items: nil, user: nil)
      @json_news_items = json_news_items
      @user = user
    end

    def call
      distribute_reads(max_lag: ::ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        news_item_ids = get_news_ids
        vote_summary_hash = NewsVote.votes_by_news_item(news_item_ids: news_item_ids)
        user_vote_hash = {}
        if @user.present?
          user_vote_hash = NewsVote.where(user: @user)
            .where(news_item_id: news_item_ids)
            .pluck(:news_item_id, :vote)
            .to_h
        end

        add_vote_data = Proc.new do |item, *args|
          news_item_id = item['id']
          vote_hash = {
            vote: user_vote_hash.dig(news_item_id),
            vote_summary: vote_summary_hash.dig(news_item_id),
          }
          item.merge({votes: vote_hash})
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
  end
end