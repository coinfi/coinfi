import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import timeago from 'timeago.js'
import CoinTags from '../CoinTags'
import BulletSpacer from '../BulletSpacer'
import twitterLogo from '../../images/logo-twitter.svg'
import linkLogo from '../../images/logo-link.svg'
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
    if (type === 'newsItem' && id === newsItem.id) className += ' bg-foam'
  }
  const url = new URL(newsItem.url)
  if (preRender) className += ' o-0 absolute'
  const newsItemTitle = newsItem.title
    .replace(/<h1>/g, '')
    .replace(/<\/h1>/g, '')

  const linkData = newsItem.coin_link_data[0]

  if (typeof linkData === 'undefined') return null

  return (
    <div
      className={className}
      style={{ height: props.height || 'auto' }}
      onClick={() => {
        readNewsHandler(newsItem, setActiveNewsItem)
      }}
    >
      <div className="pa-default">
        <Link
          to={`/news/${linkData.id}/${linkData.slug}`}
          onClick={() => {
            if (
              document.querySelector('.selected-news-content') &&
              document.querySelector('.selected-news-content').parentNode
            )
              document.querySelector(
                '.selected-news-content',
              ).parentNode.scrollTop = 0
          }}
        >
          <h4 className="pointer mb2 f5" style={hasRead ? { color: '#999' } : {}}>
            {newsItemTitle}
          </h4>
        </Link>
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
                {timeago().format(newsItem.feed_item_published_at)}
              </Fragment>
            )}
            {url.hostname === 'www.reddit.com' && (
              <Fragment>
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
              </Fragment>
            )}
            {url.hostname !== 'twitter.com' &&
              url.hostname !== 'www.reddit.com' && (
                <Fragment>
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
