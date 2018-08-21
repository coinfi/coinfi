import * as React from 'react'
import NewsBody from './NewsBody'
import CoinBody from '../common/components/CoinBody'
import Tips from './Tips'
import { ContentType } from './types';
import { Coin, User } from '../common/types';

interface Props {
  newsItemId?: string,
  coinInfo?: Coin,
  contentType: ContentType,
  closeTips: Function,
  user?: User,
};

const BodySection = (props: Props) => {
  if (props.contentType === "none") {
    return <Tips closeTips={props.closeTips} user={props.user} />;
  }

  if (props.contentType === "news") {
    return <NewsBody newsItemId={props.newsItemId} />;
  }

  if (props.contentType === 'coin') return <CoinBody coin={props.coinInfo} user={props.user} />

  return null;
}

export default BodySection
