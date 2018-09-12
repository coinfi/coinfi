import React, { Fragment } from 'react'
import timeago from 'timeago.js'
import CoinTags from '../CoinTags'
import BulletSpacer from '../BulletSpacer'
import Favicon from '~/bundles/common/components/Favicon'

const readNewsHandler = (newsItem, setActiveNewsItem) => {
  const newsId = newsItem.get('id')
  const readNewsData = JSON.parse(localStorage.getItem('readNews')) || []

  readNewsData.push(newsId)
  localStorage.setItem('readNews', JSON.stringify(readNewsData))

  setActiveNewsItem(newsItem)

  if (
    document.querySelector('.selected-news-content') &&
    document.querySelector('.selected-news-content').parentNode
  ) {
    document.querySelector('.selected-news-content').parentNode.scrollTop = 0
  }
}

const NewsListItem = (props) => {
  const {
    activeEntity,
    newsItem,
    setActiveNewsItem,
    preRender,
    hasRead,
  } = props
  let className = 'b--b tiber overflow-hidden'
  if (activeEntity) {
    const { type, id } = activeEntity
    if (type === 'newsItem' && id === newsItem.get('id'))
      className += ' bg-foam'
  }
  if (preRender) className += ' o-0 absolute'
  const newsItemTitle = newsItem
    .get('title')
    .replace(/<h1>/g, '')
    .replace(/<\/h1>/g, '')
  const parsedUrl = new URL(newsItem.get('url'))
  const linkUrl =
    parsedUrl.hostname === 'twitter.com'
      ? `https://twitter.com/${parsedUrl.pathname.split('/')[1]}`
      : newsItem.get('url')
  const linkText =
    parsedUrl.hostname === 'twitter.com'
      ? `@${parsedUrl.pathname.split('/')[1]}`
      : parsedUrl.hostname === 'www.reddit.com'
        ? `/r/${parsedUrl.pathname.split('/')[2]}`
        : parsedUrl.hostname

  return (
    <div
      className={className}
      style={{ height: props.height || 'auto' }}
      onClick={() => {
        readNewsHandler(newsItem, setActiveNewsItem)
      }}
    >
      <div data-heap="news-click-on-news-item" className="pa-default">
        <h4 className="pointer mb2 f5" style={hasRead ? { color: '#999' } : {}}>
          {newsItemTitle}
        </h4>
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
            {timeago().format(newsItem.get('feed_item_published_at'))}
          </div>
          <CoinTags {...props} itemWithCoinLinkData={newsItem} />
        </div>
      </div>
    </div>
  )
}

export default NewsListItem
