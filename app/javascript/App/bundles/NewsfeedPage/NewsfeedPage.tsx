import { IWindowScreenType, ICoinLinkData, ICoin } from '../common/types'
declare const window: IWindowScreenType

import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import debounce from 'debounce'
import { slugify } from '../../lib/utils/slugify'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '../../bundles/common/components/LayoutMobile'
import CoinListWrapper from '../common/components/CoinListWrapper'
import CoinListDrawer from '../common/components/CoinListDrawer'
import NewsList from './NewsList'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'
import BodySectionDrawer from '../../bundles/common/components/BodySectionDrawer'
import _ from 'lodash'

import { INewsItem, ContentType, IFilters } from './types'
import { CoinList } from '../common/types'
import getDefaultFilters from './defaultFilters'

const POLLING_TIMEOUT = 6000

interface IProps extends RouteComponentProps<any> {
  loggedIn: boolean
  categories: string[]
  feedSources: string[]
  coinSlug?: string
  newsItemId?: string
  coinlist: CoinList
  newslist: INewsItem[]
  isNewsfeedLoading: boolean
  isNewsfeedLoadingMoreItems: boolean
  isNewsfeedReady: boolean
  isCoinlistLoading: boolean
  isCoinlistReady: boolean
  fetchNewsItems: (filters: IFilters) => Promise<INewsItem[]>
  fetchMoreNewsItems: (filters: IFilters) => Promise<INewsItem[]>
  fetchNewNewsItems: (filters: IFilters) => Promise<INewsItem[]>
  cleanNewsItems: () => void
  selectedCoinSlug: string | null
  selectCoinBySlug: any
  isWatchlistSelected: boolean
  getWatchlist: any
  watchlist: any
}

type ActiveMobileWindow = 'CoinsList' | 'BodySection' | 'None'

interface IState {
  ActiveMobileWindow: ActiveMobileWindow
  filters: IFilters
  initialRenderTips: boolean
  isWindowFocused: boolean
  newsfeedTips: boolean
  showFilters: boolean
  unseenNewsIds: number[]
}

class NewsfeedPage extends React.Component<IProps, IState> {
  public state = {
    ActiveMobileWindow: 'None' as ActiveMobileWindow,
    filters: getDefaultFilters(),
    initialRenderTips: false,
    isWindowFocused: true,
    newsfeedTips: true,
    showFilters: false,
    unseenNewsIds: [],
  }

  public handleResize = debounce(() => this.forceUpdate(), 500)

  private documentTitle = document.title

  public startPollingNews = () => {
    setTimeout(() => {
      this.fetchNewNewsItems().then(() => {
        this.startPollingNews()
      })
    }, POLLING_TIMEOUT)
  }

  public updateTitle = (news?: INewsItem[]) => {
    if (typeof news !== 'undefined') {
      if (news.length === 0) {
        return
      }
      document.title = `${news.length} | ${this.documentTitle}`
      return
    }

    if (!this.state.unseenNewsIds.length) {
      document.title = this.documentTitle
    } else {
      document.title = `${this.state.unseenNewsIds.length} | ${
        this.documentTitle
      }`
    }
  }

  public applyFilters = (filters: IFilters) => {
    this.setState(
      {
        filters: _.cloneDeep(filters),
      },
      () => {
        this.props.cleanNewsItems()
        this.props.fetchNewsItems(this.state.filters)
      },
    )
  }

  public fetchNewNewsItems = () => {
    return this.props.fetchNewNewsItems(this.state.filters).then((news) => {
      return new Promise((resolve, reject) => {
        if (!this.state.isWindowFocused) {
          const ids = news.map((elem) => elem.id)
          const unseenNewsIds = _.uniq(this.state.unseenNewsIds.concat(ids))
          this.updateTitle(unseenNewsIds)
          this.setState(
            {
              unseenNewsIds,
            },
            () => {
              resolve()
            },
          )
        } else {
          resolve()
        }
      })
    })
  }

  public handleOnBlur = () => this.setState({ isWindowFocused: false })

  public handleOnFocus = () =>
    this.setState({ isWindowFocused: true, unseenNewsIds: [] }, () =>
      this.updateTitle(),
    )

  public getContentType(): ContentType {
    if (typeof this.props.coinSlug !== 'undefined') {
      return 'coin'
    }

    if (typeof this.props.newsItemId !== 'undefined') {
      return 'news'
    }

    return 'none'
  }

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('blur', this.handleOnBlur)
    window.addEventListener('focus', this.handleOnFocus)

    if (!document.hasFocus()) {
      this.setState({ isWindowFocused: false })
    }

    if (this.getContentType() === 'coin') {
      this.props.selectCoinBySlug(this.props.coinSlug)
      this.setState((state: IState, props: IProps) => {
        state.filters.coinSlugs.push(props.coinSlug)
        state.ActiveMobileWindow = 'BodySection'
        this.props.fetchNewsItems(state.filters).then(() => {
          this.startPollingNews()
        })
        return state
      })
    } else if (this.getContentType() === 'news') {
      this.setState({
        ActiveMobileWindow: 'BodySection',
      })
      this.props.fetchNewsItems(this.state.filters).then(() => {
        this.startPollingNews()
      })
    } else {
      if (this.props.newslist.length > 0) {
        return
      }
      this.props.fetchNewsItems(this.state.filters).then(() => {
        this.startPollingNews()
      })
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('blur', this.handleOnBlur)
    window.removeEventListener('focus', this.handleOnFocus)
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.getContentType() === 'coin') {
      if (this.props.coinSlug !== prevProps.coinSlug && !!this.props.coinSlug) {
        this.props.selectCoinBySlug(this.props.coinSlug)
        this.setState((state) => {
          state.filters.coinSlugs = [this.props.coinSlug]
          this.props.fetchNewsItems(state.filters)
          return state
        })
        return
      }
    }

    if (
      !!this.props.selectedCoinSlug &&
      !_.isEqual(this.props.selectedCoinSlug, prevProps.selectedCoinSlug)
    ) {
      this.props.history.push(`/news/${this.props.selectedCoinSlug}`)
      return
    }

    if (!!this.props.isWatchlistSelected && !prevProps.isWatchlistSelected) {
      this.setState((state) => {
        state.filters.coinSlugs = this.props
          .getWatchlist()
          .map((elem) => elem.slug)
        this.props.fetchNewsItems(state.filters)
        return state
      })
      return
    } else if (
      !!prevProps.isWatchlistSelected &&
      !this.props.isWatchlistSelected
    ) {
      this.setState((state) => {
        state.filters.coinSlugs = !!this.props.coinSlug
          ? [this.props.coinSlug]
          : []
        this.props.fetchNewsItems(state.filters)
        return state
      })
      return
    }

    if (
      !!this.props.isWatchlistSelected &&
      !_.isEqual(this.props.watchlist, prevProps.watchlist)
    ) {
      this.setState((state) => {
        state.filters.coinSlugs = this.props
          .getWatchlist()
          .map((elem) => elem.slug)
        this.props.fetchNewsItems(state.filters)
        return state
      })
      return
    }
  }

  public closeTips = () => {
    this.setState({ initialRenderTips: false })
  }

  public toggleTips = () => {
    this.setState({ initialRenderTips: !this.state.initialRenderTips })
  }

  public toggleFilters = () => {
    this.setState({ showFilters: !this.state.showFilters })
  }

  public render() {
    if (window.isMobile) {
      return (
        <LayoutMobile
          mainSection={
            <>
              <NewsListHeader
                feedSources={this.props.feedSources}
                showFilters={this.state.showFilters}
                toggleFilters={this.toggleFilters}
                toggleNewsfeedTips={this.toggleTips}
                applyFilters={this.applyFilters}
                filters={this.state.filters}
                categories={this.props.categories}
                showCoinListDrawer={() =>
                  this.setState({ ActiveMobileWindow: 'CoinsList' })
                }
              />
              <NewsList
                isShown={!this.state.showFilters}
                isWindowFocused={this.state.isWindowFocused}
                isLoading={this.props.isNewsfeedLoading}
                isInfiniteScrollLoading={this.props.isNewsfeedLoadingMoreItems}
                sortedNewsItems={this.props.newslist}
                initialRenderTips={this.state.initialRenderTips}
                fetchMoreNewsFeed={() =>
                  this.props.fetchMoreNewsItems(this.state.filters)
                }
                closeTips={this.closeTips}
                selectedNewsItemId={this.props.newsItemId}
                onNewsItemClick={(newsItem) => {
                  this.props.history.push(
                    `/news/${newsItem.id}/${slugify(newsItem.title)}`,
                  )
                  this.setState({ ActiveMobileWindow: 'BodySection' })
                }}
              />
            </>
          }
          showModal={false}
          modalSection={null}
          drawerSection={
            <>
              <CoinListDrawer
                isShown={this.state.ActiveMobileWindow === 'CoinsList'}
                onClose={() => this.setState({ ActiveMobileWindow: 'None' })}
                loggedIn={this.props.loggedIn}
                onClick={() =>
                  this.setState({ ActiveMobileWindow: 'BodySection' })
                }
              />
              <BodySectionDrawer
                isShown={this.state.ActiveMobileWindow === 'BodySection'}
                onClose={() => this.setState({ ActiveMobileWindow: 'None' })}
                bodySection={
                  <BodySection
                    coinSlug={this.props.coinSlug}
                    newsItemId={this.props.newsItemId}
                    contentType={this.getContentType()}
                    loggedIn={this.props.loggedIn}
                  />
                }
              />
            </>
          }
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          leftSection={
            <>
              <NewsListHeader
                feedSources={this.props.feedSources}
                showFilters={this.state.showFilters}
                toggleFilters={this.toggleFilters}
                toggleNewsfeedTips={this.toggleTips}
                applyFilters={this.applyFilters}
                filters={this.state.filters}
                categories={this.props.categories}
                showCoinListDrawer={() =>
                  this.setState({ ActiveMobileWindow: 'CoinsList' })
                }
              />
              <NewsList
                isShown={!this.state.showFilters}
                isWindowFocused={this.state.isWindowFocused}
                isLoading={this.props.isNewsfeedLoading}
                isInfiniteScrollLoading={this.props.isNewsfeedLoadingMoreItems}
                sortedNewsItems={this.props.newslist}
                initialRenderTips={this.state.initialRenderTips}
                fetchMoreNewsFeed={() =>
                  this.props.fetchMoreNewsItems(this.state.filters)
                }
                closeTips={this.closeTips}
                selectedNewsItemId={this.props.newsItemId}
                onNewsItemClick={(newsItem) => {
                  this.props.history.push(
                    `/news/${newsItem.id}/${slugify(newsItem.title)}`,
                  )
                }}
              />
            </>
          }
          rightSection={
            <BodySection
              coinSlug={this.props.coinSlug}
              newsItemId={this.props.newsItemId}
              contentType={this.getContentType()}
              loggedIn={this.props.loggedIn}
            />
          }
          drawerSection={
            <CoinListDrawer
              isShown={this.state.ActiveMobileWindow === 'CoinsList'}
              onClose={() => this.setState({ ActiveMobileWindow: 'None' })}
              loggedIn={this.props.loggedIn}
              onClick={() => this.setState({ ActiveMobileWindow: 'None' })}
            />
          }
        />
      )
    } else {
      return (
        <LayoutDesktop
          leftSection={
            <CoinListWrapper
              loggedIn={this.props.loggedIn}
              onClick={() => null}
            />
          }
          centerSection={
            <>
              <NewsListHeader
                feedSources={this.props.feedSources}
                showFilters={this.state.showFilters}
                toggleFilters={this.toggleFilters}
                toggleNewsfeedTips={this.toggleTips}
                applyFilters={this.applyFilters}
                filters={this.state.filters}
                categories={this.props.categories}
                showCoinListDrawer={() => null}
              />
              <NewsList
                isShown={!this.state.showFilters}
                isWindowFocused={this.state.isWindowFocused}
                isLoading={this.props.isNewsfeedLoading}
                isInfiniteScrollLoading={this.props.isNewsfeedLoadingMoreItems}
                sortedNewsItems={this.props.newslist}
                initialRenderTips={this.state.initialRenderTips}
                fetchMoreNewsFeed={() =>
                  this.props.fetchMoreNewsItems(this.state.filters)
                }
                closeTips={this.closeTips}
                selectedNewsItemId={this.props.newsItemId}
                onNewsItemClick={(newsItem) => {
                  this.props.history.push(
                    `/news/${newsItem.id}/${slugify(newsItem.title)}`,
                  )
                  this.setState({ ActiveMobileWindow: 'BodySection' })
                }}
              />
            </>
          }
          rightSection={
            <BodySection
              coinSlug={this.props.coinSlug}
              newsItemId={this.props.newsItemId}
              contentType={this.getContentType()}
              loggedIn={this.props.loggedIn}
            />
          }
        />
      )
    }
  }
}

export default withRouter<IProps>(NewsfeedPage)
