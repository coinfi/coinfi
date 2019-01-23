import * as React from 'react'
import timeago from 'timeago.js'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Favicon from '~/bundles/common/components/Favicon'
import * as _ from 'lodash'

import { formatNewsUrl } from '~/bundles/common/utils/news'

const styles = (theme) =>
  createStyles({
    read: {
      color: '#999',
    },
    unread: {},
  })

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

const NewsListItem = (props) => {
  const { newsItem, isSelected, preRender, hasRead, onClick, classes } = props

  const newsItemTitle = newsItem.title
    .replace(/<h1>/g, '')
    .replace(/<\/h1>/g, '')

  const { linkUrl, linkText } = formatNewsUrl(newsItem.url)
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
        <h4 className={hasRead ? classes.read : classes.unread}>
          {newsItemTitle}
        </h4>
        <div className="flex justify-between flex-wrap">
          <div className="f6 silver">
            <span className="mr2">
              <Favicon url={linkUrl} style={{ height: 12 }} />
            </span>
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
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

export default withStyles(styles, { withTheme: true })(NewsListItem)
