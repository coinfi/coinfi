class AssignNewsItemDefaultNewsCategories
  def initialize(news_item:)
    @news_item = news_item
  end

  def call
    if is_coin_project_tweet?
      project_announcements_category = NewsCategory.find_project_announcements!

      # Assign if does not already exist
      unless @news_item.news_categories.exists?(project_announcements_category.id)
        @news_item.news_categories << project_announcements_category
      end
    end

    # Return true if call was successful
    true
  end

  private

  def is_coin_project_tweet?
    FeedSource.twitter.include?(@news_item.feed_source) &&
      @news_item.feed_source.coin.present?
  end
end
