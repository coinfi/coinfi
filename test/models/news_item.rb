require 'test_helper'

class NewsItemTest < ActiveSupport::TestCase
  test "adds 'Project Announcements' category if is a coin project tweet" do
    coin = Coin.create!(name: 'Bitcoin')
    source = FeedSource.create!(
      name: 'CoinFi Twitter',
      feed_url: 'https://twitrss.me/twitter_user_to_rss/?user=coin_fi',
      feed_type: 'twitter',
      site_hostname: 'https://twitter.com/coin_fi',
      coin: coin
    )
    category = NewsCategory.find_or_create_by!(name: 'Project Announcements')

    news_item = NewsItem.create(
      feed_source: source,
      feed_item_id: 'https://twitter.com/coin_fi/status/1023172611314933760',
      url: 'https://twitter.com/coin_fi/status/1023172611314933760',
      title: 'CoinFi in Bangkok. Are you there? https://twitter.com/timothytam8/status/1023109999386476544 …',
      summary: '<p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text"  lang="en">CoinFi in Bangkok. Are you there?  <a href="https://twitter.com/timothytam8/status/1023109999386476544">https://twitter.com/timothytam8/status/1023109999386476544&nbsp;&hellip;</a></p>',
      content: nil,
      actor_id: '(@coin_fi)',
      feed_item_published_at: 2.days.ago,
      feed_item_updated_at: 1.day.ago
    )

    assert_includes news_item.news_categories, category
  end
end
