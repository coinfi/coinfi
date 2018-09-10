import React, { Fragment } from 'react'
import timeago from 'timeago.js'
import CoinTags from '../CoinTags'
import BulletSpacer from '../BulletSpacer'
import twitterLogo from '../../images/logo-twitter.svg'
import redditLogo from '../../images/logo-reddit.svg'

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
  const url = new URL(newsItem.get('url'))
  if (preRender) className += ' o-0 absolute'
  const newsItemTitle = newsItem
    .get('title')
    .replace(/<h1>/g, '')
    .replace(/<\/h1>/g, '')

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
            {url.hostname === 'twitter.com' && (
              <Fragment>
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
                {timeago().format(newsItem.get('feed_item_published_at'))}
              </Fragment>
            )}
            {url.hostname === 'www.reddit.com' && (
              <Fragment>
                <span className="mr2">
                  <img src={redditLogo} style={{ height: 12 }} />
                </span>
                <a
                  href={newsItem.get('url')}
                  target="_blank noopener noreferrer"
                  rel="nofollow"
                  className="dib silver"
                >
                  {`/r/${url.pathname.split('/')[2]}`}
                </a>
                <BulletSpacer />
                {timeago().format(newsItem.get('feed_item_published_at'))}
              </Fragment>
            )}
            {url.hostname !== 'twitter.com' &&
              url.hostname !== 'www.reddit.com' && (
                <Fragment>
                  <span className="mr2">
                    <i
                      className="material-icons"
                      style={{ position: 'relative', top: 7 }}
                    >
                      link
                    </i>
                  </span>
                  <a
                    href={newsItem.get('url')}
                    target="_blank noopener noreferrer"
                    rel="nofollow"
                    className="dib silver"
                  >
                    {url.hostname}
                  </a>
                  <BulletSpacer />
                  {timeago().format(newsItem.get('feed_item_published_at'))}
                </Fragment>
              )}
          </div>
          <CoinTags {...props} itemWithCoinLinkData={newsItem} />
        </div>
      </div>
    </div>
  )
}

export default NewsListItem
