/* tslint:disable */
import * as React from 'react'
import NewsBody from './NewsBody'
import CoinBody from '../common/components/CoinBody'
import Tips from './Tips'
import { ContentType } from './types'

interface Props {
  newsItemId?: string
  coinSlug?: string
  contentType: ContentType
  loggedIn: boolean
}

const BodySection = (props: Props) => {
  if (props.contentType === 'none') {
    return <Tips loggedIn={props.loggedIn} />
  }

  if (props.contentType === 'news') {
    return <NewsBody newsItemId={props.newsItemId} />
  }

  if (props.contentType === 'coin')
    return <CoinBody coinSlug={props.coinSlug} loggedIn={props.loggedIn} />

  return null
}

export default BodySection
