/* tslint:disable */
import * as React from 'react'
import NewsBody from './NewsBody'
import CoinBody from '../common/components/CoinBody'
import Tips from './Tips'
import { ContentType, NewsItem } from './types'
import { CoinWithDetails, CoinClickHandler } from '~/bundles/common/types'

interface Props {
  initialNewsItem?: NewsItem
  initialCoinWithDetails?: CoinWithDetails
  newsItemId?: string
  coinSlug?: string
  contentType: ContentType
  loggedIn: boolean
  onCoinClick?: CoinClickHandler
}

const BodySection = (props: Props) => {
  if (props.contentType === 'none') {
    return <Tips loggedIn={props.loggedIn} />
  }

  if (props.contentType === 'news') {
    return (
      <NewsBody
        initialNewsItem={props.initialNewsItem}
        newsItemId={props.newsItemId}
        onCoinClick={props.onCoinClick}
        loggedIn={props.loggedIn}
      />
    )
  }

  if (props.contentType === 'coin') {
    return (
      <CoinBody
        initialCoinWithDetails={props.initialCoinWithDetails}
        coinSlug={props.coinSlug}
        loggedIn={props.loggedIn}
      />
    )
  }

  return null
}

export default BodySection
