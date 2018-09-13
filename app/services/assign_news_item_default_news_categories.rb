class AssignNewsItemDefaultNewsCategories
  def initialize(news_item:)
    @news_item = news_item
  end

  def call
    if is_coin_project_tweet?
      @news_item.news_categories << NewsCategory.find_project_announcements!
      @news_item.last_machine_tagged_on = Time.now
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
