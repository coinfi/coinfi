import React, { Component } from 'react'
import CoinTags from '../CoinTags'
import { Tweet } from 'react-twitter-widgets'

export default class NewsBody extends Component {
  render() {
    const {
      selectNewsItemFromList,
      activeEntity,
      selectNewsCategories,
    } = this.props
    const newsItem = selectNewsItemFromList(activeEntity.id)
    if (!newsItem) {
      return null
    }
    const categories = selectNewsCategories(newsItem)

    return (
      <div className="pa4 bg-white min-h-100">
        <CoinTags itemWithCoinLinkData={newsItem} />
        {categories.size > 0 && (
          <div className="mt3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.get('name')}
              </div>
            ))}
          </div>
        )}
        <Tweet tweetId={this.props.activeEntity.tweetId} options={window.darkModeEnabled ? {theme:'dark'} : {}} />
      </div>
    )
  }
}
