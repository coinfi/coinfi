import React, { Component } from 'react'
import NewsCoinTags from './NewsCoinTags'

export default class NewsBody extends Component {
  componentDidMount() {
    this.renderTweet(this.props.activeEntity.tweetId)
  }

  renderTweet(tweetId) {
    twttr.widgets.createTweet(
      tweetId,
      document.getElementById('tweet-container'),
      { theme: 'light' }
    )
  }

  render() {
    const {
      selectNewsItemFromList,
      activeEntity,
      selectNewsCategories
    } = this.props
    const newsItem = selectNewsItemFromList(activeEntity.id)
    if (!newsItem) {
      return null
    }
    const categories = selectNewsCategories(newsItem)

    if ([].slice.call([document.getElementById('tweet-container')]).length) {
      $('#tweet-container').empty()
      this.renderTweet(this.props.activeEntity.tweetId)
    }

    return (
      <div className="pa4 bg-white min-h-100">
        <NewsCoinTags newsItem={newsItem} />
        {categories.size > 0 && (
          <div className="mt3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.get('name')}
              </div>
            ))}
          </div>
        )}
        <div id="tweet-container"></div>
      </div>
    )
  }
}
