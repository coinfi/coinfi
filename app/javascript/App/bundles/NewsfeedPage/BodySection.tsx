import * as React from 'react'
import NewsBody from './NewsBody'
import CoinBody from '../common/components/CoinBody'
import TwitterBody from './TwitterBody'
import Tips from './Tips'
import LoadingIndicator from '../../components/LoadingIndicator'
import { ContentType, NewsItem } from './types'
import { Coin, User } from '../common/types'

import { getDomainType } from '../../lib/utils/url'

interface Props {
  newsItem?: NewsItem
  coinInfo?: Coin
  contentType: ContentType
  closeTips: Function
  user?: User
}

const BodySection = (props: Props) => {
  if (props.contentType === 'none') {
    return <Tips closeTips={props.closeTips} user={props.user} />
  }

  if (props.contentType === 'news') {
    if (!props.newsItem) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    }

    if (getDomainType(props.newsItem.url) === 'twitter') {
      return <TwitterBody newsItem={props.newsItem} />
    }

    return <NewsBody newsItem={props.newsItem} />
  }

  if (props.contentType === 'coin')
    return <CoinBody coin={props.coinInfo} user={props.user} />

  return null
}

export default BodySection
