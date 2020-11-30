module NewsServices
  class ProcessNewsItemRaws < Patterns::Service
    attr_reader :has_processed_items

    def initialize
      @has_processed_items = false
    end

    def call
      process_news_item_raws
      refresh_news_cache
    end

    private

    def process_news_item_raws
      NewsItemRaw.unprocessed.find_in_batches do |group|
        has_processed_items = true
        group.each do |news_item_raw|
          news_item_raw.process!
        end
      end
    end

    def refresh_news_cache
      if has_processed_items
        get_default_news_item_ids(rewrite_cache: true)
      end
    end
  end
end