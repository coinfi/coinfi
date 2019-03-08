module NewsServices
  class RetrieveDefaultNewsItems < Patterns::Service
    def initialize(limit: 25)
      @limit = limit
    end

    def call
      distribute_reads(max_lag: ::ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        @news_items = default_news_query.to_a
        if @news_items.empty? || @news_items.length < @limit
          @news_items = backup_default_news_query.to_a
        end

        @news_items
      end
    end

    private

    def default_news_query
      NewsItems::WithFilters.call(NewsItem.published)
        .includes(:coins, :news_categories)
        .order_by_published
        .limit(@limit)
    end

    def backup_default_news_query
      NewsItem.published
        .includes(:coins, :news_categories)
        .order_by_published
        .limit(@limit)
    end
  end
end