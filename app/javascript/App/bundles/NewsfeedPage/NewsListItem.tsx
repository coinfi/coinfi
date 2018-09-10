import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import timeago from 'timeago.js'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '../../components/BulletSpacer'
import { slugify } from '../../lib/utils/slugify'

const twitterLogo = require('../../images/logo-twitter.svg')
const linkLogo = require('../../images/logo-link.svg')
const redditLogo = require('../../images/logo-reddit.svg')

import classNames from 'classnames'

const readNewsHandler = (newsItem) => {
  const newsId = newsItem.id
  const readNewsData = JSON.parse(localStorage.getItem('readNews')) || []

  readNewsData.push(newsId)
  localStorage.setItem('readNews', JSON.stringify(readNewsData))

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
  const {
    activeEntity,
    newsItem,
    setActiveNewsItem,
    isSelected,
    preRender,
    hasRead,
    onClick,
  } = props

  const url = new URL(newsItem.url)
  const newsItemTitle = newsItem.title
    .replace(/<h1>/g, '')
    .replace(/<\/h1>/g, '')

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
            {url.hostname === 'twitter.com' && (
              <>
                <span className="mr2">
                  <img src={twitterLogo} style={{ height: 11 }} />
                </span>
                <a
                  href={`https://twitter.com/${url.pathname.split('/')[1]}`}
                  target="_blank noopener noreferrer"
                  rel="nofollow"
                  className="dib silver"
                >
                  {`@${url.pathname.split('/')[1]}`}
                </a>
                <BulletSpacer />
                {timeago().format(newsItem.feed_item_published_at)}
              </>
            )}
            {url.hostname === 'www.reddit.com' && (
              <>
                <span className="mr2">
                  <img src={redditLogo} style={{ height: 12 }} />
                </span>
                <a
                  href={newsItem.url}
                  target="_blank noopener noreferrer"
                  rel="nofollow"
                  className="dib silver"
                >
                  {`/r/${url.pathname.split('/')[2]}`}
                </a>
                <BulletSpacer />
                {timeago().format(newsItem.feed_item_published_at)}
              </>
            )}
            {url.hostname !== 'twitter.com' &&
              url.hostname !== 'www.reddit.com' && (
                <>
                  <span className="mr2">
                    <img src={linkLogo} style={{ height: 9 }} />
                  </span>
                  <a
                    href={newsItem.url}
                    target="_blank noopener noreferrer"
                    rel="nofollow"
                    className="dib silver"
                  >
                    {url.hostname}
                  </a>
                  <BulletSpacer />
                  {timeago().format(newsItem.feed_item_published_at)}
                </>
              )}
          </div>
          <CoinTags {...props} itemWithCoinLinkData={newsItem} />
        </div>
      </div>
    </div>
  )
}

export default NewsListItem
