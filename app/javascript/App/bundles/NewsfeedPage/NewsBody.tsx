import * as React from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '../../components/BulletSpacer'
import Icon from '../../components/Icon'

import { NewsItem } from './types';

interface NewsBodyProps {
  newsItem: NewsItem,
};

export default class NewsBody extends React.Component<NewsBodyProps, {}>  {
  render() {
    const { newsItem } = this.props;
  
    if (!newsItem) {
      return null
    }

    const categories = newsItem.categories;

    const content = _.trim(newsItem.content) || _.trim(newsItem.summary);

    return (
      <div className="pa3 bg-white min-h-100 selected-news-content">
        <CoinTags itemWithCoinLinkData={newsItem} />
        <h1 className="break-word f4">{newsItem.title}</h1>
        <div className="mb3 f6">
          <a
            href={newsItem.url}
            target="_blank"
            rel="nofollow"
            className="break-all"
          >
            <Icon name="link" className="mr1 f7" regular />
            {newsItem.url}
          </a>
        </div>
        <div className="mb3 f6">
          <Icon name="clock" className="mr1 f7" regular />
          {timeago().format(newsItem.feed_item_published_at)}
          <BulletSpacer />
          <span>
            {new Date(newsItem.feed_item_published_at).toLocaleString()}
          </span>
        </div>
        {categories.length > 0 && (
          <div className="mv3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.name}
              </div>
            ))}
          </div>
        )}
        <div className="mv3 b--b" />
        <div
          className="lh-copy"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
          }}
        />
      </div>
    )
  }
}
