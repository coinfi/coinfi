import * as React from 'react'
import * as moment from 'moment'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Favicon from '~/bundles/common/components/Favicon'
import Votes from './Votes'
import * as _ from 'lodash'
import { tiber } from '~/bundles/common/styles/colors'

import { formatNewsUrl } from '~/bundles/common/utils/news'

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    read: {
      color: `${theme.palette.text.secondary} !important`,
    },
    unread: {
      color: `${theme.palette.text.primary} !important`,
    },
    wrapper: {
      color: isDarkMode ? theme.palette.text.primary : tiber,
      borderColor: theme.palette.border.main,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      background: theme.palette.background.paper,
      overflow: 'hidden',
      '&.selected': {
        background: theme.palette.background.selected,
      },
    },
    detailsWrapper: {},
    details: {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    },
    coinTags: {
      marginLeft: 'auto',
    },
  })
}

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
  const { newsItem, isSelected, hasRead, onClick, onCoinClick, classes } = props
  const newsItemTitle = newsItem.title

  const { linkUrl, linkText } = formatNewsUrl(newsItem.url)
  return (
    <div
      className={classNames(classes.wrapper, { selected: isSelected })}
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
          <div className={classes.details}>
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
            {moment(newsItem.feed_item_published_at).fromNow()}
            <BulletSpacer />
            <Votes newsItemId={newsItem.id} />
          </div>
          <CoinTags
            className={classes.coinTags}
            onClick={onCoinClick}
            itemWithCoinLinkData={newsItem}
          />
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(NewsListItem)
