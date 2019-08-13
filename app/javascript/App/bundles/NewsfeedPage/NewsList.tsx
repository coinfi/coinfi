import * as React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import * as _ from 'lodash'
import NewsListItem from './NewsListItem'
import LoadingIndicator from '../common/components/LoadingIndicator'
import Tips from './Tips'
import withDevice from '~/bundles/common/utils/withDevice'
import { withStyles, createStyles } from '@material-ui/core/styles'

import { NewsItem } from './types'
import { CoinLinkData } from '~/bundles/common/types'

interface Props {
  classes: any
  isShown: boolean
  isLoading: boolean
  sortedNewsItems: NewsItem[]
  initialRenderTips: boolean
  fetchMoreNewsFeed: () => void
  closeTips: () => void
  isWindowFocused: boolean
  selectedNewsItemId: string
  onNewsItemClick: (newsItem: NewsItem) => void
  onCoinClick: (coinData: CoinLinkData) => void
  hasMore: boolean
  isMobile: boolean
  loggedIn: boolean
}

interface State {
  initialRender: boolean
  initialRenderTips: boolean
  readNewsIds: number[]
}

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    emptyRoot: {
      textAlign: 'center',
      padding: '1rem',
      marginTop: '2rem',
      color: theme.palette.text.primary,
      '& h1, h2, h3, h4, h5': {
        color: `${theme.palette.text.heading} !important`,
      },
    },
    newsfeed: {
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
      position: 'relative',
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
      [theme.breakpoints.up('md')]: {
        overflowY: 'auto',
      },
    },
    infiniteScroll: {
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    },
  })
}

const NewsListWrapper = ({
  classes,
  isMobile,
  initialRenderTips,
  children,
}) => {
  return (
    <div
      id="newsfeed"
      className={classes.newsfeed}
      style={
        isMobile && initialRenderTips
          ? {
              background: '#fff',
              overflow: 'hidden',
              position: 'absolute',
            }
          : {}
      }
    >
      {children}
    </div>
  )
}

const NewsListItemsContainer = (props) => {
  const mappedItems = props.sortedNewsItems.map((newsItem) => {
    const hasRead = props.readNewsIds.includes(newsItem.id)
    return (
      <NewsListItem
        key={newsItem.id}
        newsItem={newsItem}
        isSelected={
          newsItem.id && props.selectedNewsItemId === newsItem.id.toString()
        }
        hasRead={hasRead}
        onClick={props.onSelect}
        onCoinClick={props.onCoinClick}
      />
    )
  })

  return (
    <InfiniteScroll
      className={props.classes.infiniteScroll}
      dataLength={mappedItems.length}
      scrollableTarget="newsfeed"
      next={props.fetchMoreNewsFeed}
      hasMore={props.hasMore}
      loader={<LoadingIndicator />}
      endMessage={
        <p className="tc">
          <b>No more news present in the database.</b>
        </p>
      }
    >
      {mappedItems}
    </InfiniteScroll>
  )
}

class NewsList extends React.Component<Props, State> {
  public state = {
    initialRender: true,
    initialRenderTips: false,
    readNewsIds: [],
  }

  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    this.refreshReadNewsIds()
  }

  public onSelect = (newsItem) => {
    this.props.onNewsItemClick(newsItem)
    this.refreshReadNewsIds()
  }

  public refreshReadNewsIds = () => {
    const hasLocalStorage = !_.isError(_.attempt(() => localStorage))
    const readNewsIds = hasLocalStorage
      ? JSON.parse(localStorage.getItem('readNews')) || []
      : []

    this.setState({ readNewsIds })
  }

  public render() {
    if (!this.props.isShown) {
      return null
    }

    const { classes, ...remainingProps } = this.props

    return (
      <NewsListWrapper {...this.props}>
        {this.props.initialRenderTips && this.props.isMobile ? (
          <Tips
            closeTips={this.props.closeTips}
            loggedIn={this.props.loggedIn}
          />
        ) : this.props.isLoading ? (
          <div className="pa3 tc mt4">
            <LoadingIndicator />
          </div>
        ) : !this.props.sortedNewsItems.length ? (
          <div className={classes.emptyRoot}>
            <div className="pointer">
              <h4 className="fw6 mv3 f4">No results found.</h4>
            </div>
            <div className="flex justify-between flex-wrap">
              <div className="f6 silver center">
                <span className="ph2">
                  Try changing your search query or removing some filters.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <NewsListItemsContainer
            onSelect={this.onSelect}
            readNewsIds={this.state.readNewsIds}
            classes={classes}
            {...remainingProps}
          />
        )}
      </NewsListWrapper>
    )
  }
}

export default withStyles(styles)(withDevice(NewsList))
