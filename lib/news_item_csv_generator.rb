class NewsItemCsvGenerator
  def self.to_csv(news_items, options = {})
    column_headers = %w[id, coin_symbols, news_categories, user_email, title, created_at]
    CSV.generate(options) do |csv|
      news_items.includes(:news_coin_mentions, :coins, :news_item_categorizations, :news_categories).each do |news_item|
        csv << [
          news_item.id,
          news_item.coin_symbols,
          news_item.news_category_names,
          news_item.user_id,
          news_item.title,
          news_item.created_at,
        ]
      end
    end
  end
end
