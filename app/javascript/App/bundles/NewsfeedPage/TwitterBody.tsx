import * as React from 'react'
import { Tweet } from 'react-twitter-widgets'
import CoinTags from '../common/components/CoinTags'
import { NewsItem } from './types'
import { getTweetId } from '../../lib/utils/url'

interface Props {
  newsItem: NewsItem
}

export default class NewsBody extends React.Component<Props, {}> {
  public render() {
    const { newsItem } = this.props

    if (!newsItem) {
      return null
    }

    const tweetId = getTweetId(newsItem.url)

    const categories = newsItem.categories

    return (
      <div className="pa4 bg-white min-h-100">
        <CoinTags itemWithCoinLinkData={newsItem} />
        {categories.length > 0 && (
          <div className="mt3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.name}
              </div>
            ))}
          </div>
        )}
        <Tweet tweetId={tweetId} />
      </div>
    )
  }
}
