import * as React from 'react'
import styled from 'styled-components'
import timeago from 'timeago.js'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import classNames from 'classnames'
import Favicon from '~/bundles/common/components/Favicon'
import * as _ from 'lodash'
import URL from 'url-parse'
import {
  getTwitterUsername,
  getSubredditName,
  isTwitter,
  isReddit,
} from '~/bundles/common/utils/url'

const readNewsHandler = (newsItem) => {
  const newsId = newsItem.id

  const hasLocalStorage = !_.isError(_.attempt(() => localStorage))
  if (hasLocalStorage) {
    const readNewsData = JSON.parse(localStorage.getItem('readNews')) || []
    readNewsData.push(newsId)
    localStorage.setItem('readNews', JSON.stringify(readNewsData))
  }

  if (
    document.querySelector('.selected-news-content') &&
    document.querySelector('.selected-news-content').parentNode
  ) {
    // @ts-ignore
    document.querySelector('.selected-news-content').parentNode.scrollTop = 0
  }
}

const Title = styled.h4`
  ${({ hasRead }: any) =>
    hasRead &&
    `
    color: #999;
  `};
`

const NewsListItem = (props) => {
  const { newsItem, isSelected, preRender, hasRead, onClick } = props

  const newsItemTitle = newsItem.title
    .replace(/<h1>/g, '')
    .replace(/<\/h1>/g, '')

  const parsedUrl = new URL(newsItem.url)
  const linkUrl = isTwitter(newsItem.url)
    ? `https://twitter.com/${parsedUrl.pathname.split('/')[1]}`
    : newsItem.url
  const linkText = isTwitter(newsItem.url)
    ? `@${getTwitterUsername(newsItem.url)}`
    : isReddit(newsItem.url)
      ? `/r/${getSubredditName(newsItem.url)}`
      : parsedUrl.hostname

  return (
    <div
      className={classNames(
        'b--b tiber overflow-hidden',
        { 'bg-foam': isSelected },
        { 'o-0 absolute': preRender },
      )}
      style={{ height: props.height || 'auto' }}
    >
      <div
        data-heap="news-click-on-news-item"
        className="pa-default"
        onClick={() => {
          readNewsHandler(newsItem)
          if (
            document.querySelector('.selected-news-content') &&
            document.querySelector('.selected-news-content').parentNode
          ) {
            document.querySelector(
              '.selected-news-content',
              // @ts-ignore
            ).parentNode.scrollTop = 0
          }
          onClick(newsItem)
        }}
      >
        <Title hasRead={hasRead}>{newsItemTitle}</Title>
        <div className="flex justify-between flex-wrap">
          <div className="f6 silver">
            <span className="mr2">
              <Favicon url={linkUrl} style={{ height: 12 }} />
            </span>
            <a
              href={linkUrl}
              target="_blank noopener noreferrer"
              rel="nofollow"
              className="dib silver"
            >
              {linkText}
            </a>
            <BulletSpacer />
            {timeago().format(newsItem.feed_item_published_at)}
          </div>
          <CoinTags {...props} itemWithCoinLinkData={newsItem} />
        </div>
      </div>
    </div>
  )
}

export default NewsListItem
