import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import debounce from 'debounce'
import slugify from '~/bundles/common/utils/slugify'
import LayoutDesktop from '~/bundles/common/components/LayoutDesktop'
import LayoutTablet from '~/bundles/common/components/LayoutTablet'
import LayoutMobile from '~/bundles/common/components/LayoutMobile'
import CoinListWrapper from '../common/components/CoinListWrapper'
import CoinListDrawer from '../common/components/CoinListDrawer'
import NewsList from './NewsList'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'
import BodySectionDrawer from '../../bundles/common/components/BodySectionDrawer'
import * as _ from 'lodash'
import withDevice from '~/bundles/common/utils/withDevice'
import EventListener from 'react-event-listener'

import { NewsItem, ContentType, Filters } from './types'
import { CoinWithDetails, CoinClickHandler } from '../common/types'
import { CoinOption } from '~/bundles/common/components/CoinSelector'
import {
  getDefaultFilters,
  mergeInitialSocialSourcesForCoinsFilter,
} from './utils'

const POLLING_TIMEOUT = 60000

interface Props extends RouteComponentProps<any> {
  loggedIn: boolean
  categories: string[]
  feedSources: string[]
  coinSlug?: string
  topCoinSlugs: string[]
  newsItemId?: string
  newslist: NewsItem[]
  initialNewsItem?: NewsItem
  initialCoinWithDetails?: CoinWithDetails
  isNewsfeedLoading: boolean
  fetchNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchMoreNewsItems: (filters: Filters) => Promise<NewsItem[]>
  fetchNewNewsItems: (filters: Filters) => Promise<NewsItem[]>
  cleanNewsItems: () => void
  selectedCoinSlug: string | null
  selectCoinBySlug: any
  isWatchlistSelected: boolean
  getWatchlist: any
  watchlist: any
  hasMore: boolean
  isMobile: boolean
  isTablet: boolean
}

type ActiveMobileWindow = 'CoinsList' | 'BodySection' | 'None'

interface State {
  ActiveMobileWindow: ActiveMobileWindow
  filters: Filters
  initialRenderTips: boolean
  isWindowFocused: boolean
  newsfeedTips: boolean
  showFilters: boolean
  unseenNewsIds: number[]
  selectedCoin: string
}

class NewsfeedPage extends React.Component<Props, State> {
  public handleResize = debounce(() => this.forceUpdate(), 500)

  private initialDocumentTitle

  constructor(props) {
    super(props)

    this.state = {
      ActiveMobileWindow: this.getInitialActiveMobileWindow(),
      filters: this.getInitialFilters(),
      initialRenderTips: false,
      isWindowFocused: true,
      newsfeedTips: true,
      showFilters: false,
      unseenNewsIds: [],
      selectedCoin: null,
    }
  }

  public getInitialDocumentTitle = () => {
    if (this.initialDocumentTitle) {
      return this.initialDocumentTitle
    }

    this.initialDocumentTitle = document.title
    return this.initialDocumentTitle
  }

  public startPollingNews = () => {
    setTimeout(() => {
      this.fetchNewNewsItems().then(() => {
        this.startPollingNews()
      })
    }, POLLING_TIMEOUT)
  }

  public updateTitle = (newsIds?: number[]) => {
    if (typeof newsIds !== 'undefined') {
      if (newsIds.length === 0) {
        return
      }
      document.title = `${newsIds.length} | ${this.getInitialDocumentTitle()}`
      return
    }

    if (!this.state.unseenNewsIds.length) {
      document.title = this.getInitialDocumentTitle()
    } else {
      document.title = `${
        this.state.unseenNewsIds.length
      } | ${this.getInitialDocumentTitle()}`
    }
  }

  public applyFilters = (filters: Filters) => {
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

  public getInitialActiveMobileWindow = () => {
    if (this.getContentType() === 'none') {
      return 'None'
    }

    return 'BodySection'
  }

  public getInitialFilters = () => {
    const defaultFilters = getDefaultFilters()
    const coinSlugs = _.compact([
      ...defaultFilters.coinSlugs,
      this.props.coinSlug,
    ])

    const result = {
      ...defaultFilters,
      coinSlugs,
      feedSources: mergeInitialSocialSourcesForCoinsFilter(
        defaultFilters.feedSources,
        coinSlugs,
        this.props.topCoinSlugs,
      ),
    }

    return result
  }

  public componentDidMount() {
    // Ensure CoinListContainer provider state is in sync
    if (this.getContentType() === 'coin') {
      this.props.selectCoinBySlug(this.props.coinSlug)
    }

    // Should check if not defined but currently all defaults are using an empty array instead
    if (_.isEmpty(this.props.newslist)) {
      // Perform initial fetch and then start polling
      this.props.fetchNewsItems(this.state.filters).then(() => {
        this.startPollingNews()
      })
    } else {
      // Start polling
      this.startPollingNews()
    }
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if `coinSlug` in the route changed
    if (this.getContentType() === 'coin') {
      if (this.props.coinSlug !== prevProps.coinSlug && !!this.props.coinSlug) {
        this.props.selectCoinBySlug(this.props.coinSlug)
        this.setState((state) => {
          const newState = {
            ...state,
            filters: {
              ...state.filters,
              coinSlugs: [this.props.coinSlug],
              feedSources: mergeInitialSocialSourcesForCoinsFilter(
                state.filters.feedSources,
                state.filters.coinSlugs,
                this.props.topCoinSlugs,
              ),
            },
            selectedCoin: this.props.coinSlug,
          }

          this.props.fetchNewsItems(newState.filters)
          return newState
        })
        return
      }
    }

    // Check if `selectedCoinSlug` changed from context
    if (
      !!this.props.selectedCoinSlug &&
      !_.isEqual(this.props.selectedCoinSlug, prevProps.selectedCoinSlug)
    ) {
      this.props.history.push(`/news/${this.props.selectedCoinSlug}`)
      return
    }

    // Check if watchlist tab changed to active
    if (
      !!this.props.isWatchlistSelected &&
      !prevProps.isWatchlistSelected &&
      this.props.loggedIn
    ) {
      this.setState((state) => {
        const newState = {
          ...state,
          filters: {
            ...state.filters,
            coinSlugs: this.props.getWatchlist().map((elem) => elem.slug),
            feedSources: mergeInitialSocialSourcesForCoinsFilter(
              state.filters.feedSources,
              state.filters.coinSlugs,
              this.props.topCoinSlugs,
            ),
          },
          selectedCoin: null,
        }

        this.props.fetchNewsItems(newState.filters)
        return newState
      })
      return

      // Check if watchlist tab changed to inactive
    } else if (
      !!prevProps.isWatchlistSelected &&
      !this.props.isWatchlistSelected &&
      this.props.loggedIn
    ) {
      this.setState((state) => {
        const newState = {
          ...state,
          filters: {
            ...state.filters,
            coinSlugs: !!this.props.coinSlug ? [this.props.coinSlug] : [],
            feedSources: mergeInitialSocialSourcesForCoinsFilter(
              state.filters.feedSources,
              state.filters.coinSlugs,
              this.props.topCoinSlugs,
            ),
          },
          selectedCoin: null,
        }

        this.props.fetchNewsItems(newState.filters)
        return newState
      })
      return
    }

    // Check if watchlist changed
    if (
      !!this.props.isWatchlistSelected &&
      !_.isEqual(this.props.watchlist, prevProps.watchlist)
    ) {
      this.setState((state) => {
        const newState = {
          ...state,
          filters: {
            ...state.filters,
            coinSlugs: this.props.getWatchlist().map((elem) => elem.slug),
            feedSources: mergeInitialSocialSourcesForCoinsFilter(
              state.filters.feedSources,
              state.filters.coinSlugs,
              this.props.topCoinSlugs,
            ),
          },
          selectedCoin: null,
        }

        this.props.fetchNewsItems(newState.filters)
        return newState
      })
      return
    }
  }

  public onCoinChange = (selectedOption: CoinOption) => {
    const value = selectedOption ? selectedOption.value : null

    // get previous coin slug based on component update logic
    const defaultCoinSlugs = this.props.isWatchlistSelected
      ? this.props.getWatchlist().map((elem) => elem.slug)
      : !!this.props.coinSlug
        ? [this.props.coinSlug]
        : []

    const coinSlugs = value ? [value] : defaultCoinSlugs
    const feedSources = mergeInitialSocialSourcesForCoinsFilter(
      this.state.filters.feedSources,
      coinSlugs,
      this.props.topCoinSlugs,
    )

    this.setState(
      {
        selectedCoin: value,
        filters: {
          ...this.state.filters,
          coinSlugs,
          feedSources,
        },
      },
      () => {
        this.props.cleanNewsItems()
        this.props.fetchNewsItems(this.state.filters)
      },
    )

    value
      ? this.props.history.push(`/news/${value}`)
      : this.props.history.push(`/news`)
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
    if (this.props.isMobile) {
      const coinClickHandler: CoinClickHandler = (coinData) => {
        this.props.history.push(`/news/${coinData.slug}`)
        this.setState({ ActiveMobileWindow: 'None' })
      }
      return (
        <EventListener
          target="window"
          onResize={this.handleResize}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
        >
          <LayoutMobile
            mainSection={
              <>
                <NewsListHeader
                  feedSources={this.props.feedSources}
                  topCoinSlugs={this.props.topCoinSlugs}
                  showFilters={this.state.showFilters}
                  toggleFilters={this.toggleFilters}
                  toggleNewsfeedTips={this.toggleTips}
                  applyFilters={this.applyFilters}
                  filters={this.state.filters}
                  categories={this.props.categories}
                  showCoinListDrawer={() =>
                    this.setState({ ActiveMobileWindow: 'CoinsList' })
                  }
                  onCoinChange={this.onCoinChange}
                  selectedCoin={this.state.selectedCoin}
                />
                <NewsList
                  isShown={!this.state.showFilters}
                  isWindowFocused={this.state.isWindowFocused}
                  isLoading={this.props.isNewsfeedLoading}
                  sortedNewsItems={this.props.newslist}
                  initialRenderTips={this.state.initialRenderTips}
                  fetchMoreNewsFeed={() =>
                    this.props.fetchMoreNewsItems(this.state.filters)
                  }
                  closeTips={this.closeTips}
                  selectedNewsItemId={this.props.newsItemId}
                  onNewsItemClick={(newsItem: NewsItem) => {
                    this.props.history.push(
                      `/news/${newsItem.id}/${slugify(newsItem.title)}`,
                    )
                    this.setState({ ActiveMobileWindow: 'BodySection' })
                  }}
                  onCoinClick={coinClickHandler}
                  hasMore={this.props.hasMore}
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
                      initialNewsItem={this.props.initialNewsItem}
                      initialCoinWithDetails={this.props.initialCoinWithDetails}
                      contentType={this.getContentType()}
                      loggedIn={this.props.loggedIn}
                      onCoinClick={coinClickHandler}
                    />
                  }
                />
              </>
            }
          />
        </EventListener>
      )
    } else if (this.props.isTablet) {
      const coinClickHandler: CoinClickHandler = (coinData) => {
        this.props.history.push(`/news/${coinData.slug}`)
      }
      return (
        <EventListener
          target="window"
          onResize={this.handleResize}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
        >
          <LayoutTablet
            leftSection={
              <>
                <NewsListHeader
                  feedSources={this.props.feedSources}
                  topCoinSlugs={this.props.topCoinSlugs}
                  showFilters={this.state.showFilters}
                  toggleFilters={this.toggleFilters}
                  toggleNewsfeedTips={this.toggleTips}
                  applyFilters={this.applyFilters}
                  filters={this.state.filters}
                  categories={this.props.categories}
                  showCoinListDrawer={() =>
                    this.setState({ ActiveMobileWindow: 'CoinsList' })
                  }
                  onCoinChange={this.onCoinChange}
                  selectedCoin={this.state.selectedCoin}
                />
                <NewsList
                  isShown={!this.state.showFilters}
                  isWindowFocused={this.state.isWindowFocused}
                  sortedNewsItems={this.props.newslist}
                  initialRenderTips={this.state.initialRenderTips}
                  isLoading={this.props.isNewsfeedLoading}
                  fetchMoreNewsFeed={() =>
                    this.props.fetchMoreNewsItems(this.state.filters)
                  }
                  closeTips={this.closeTips}
                  selectedNewsItemId={this.props.newsItemId}
                  onNewsItemClick={(newsItem: NewsItem) => {
                    this.props.history.push(
                      `/news/${newsItem.id}/${slugify(newsItem.title)}`,
                    )
                  }}
                  onCoinClick={coinClickHandler}
                  hasMore={this.props.hasMore}
                />
              </>
            }
            rightSection={
              <BodySection
                coinSlug={this.props.coinSlug}
                newsItemId={this.props.newsItemId}
                initialNewsItem={this.props.initialNewsItem}
                initialCoinWithDetails={this.props.initialCoinWithDetails}
                contentType={this.getContentType()}
                loggedIn={this.props.loggedIn}
                onCoinClick={coinClickHandler}
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
        </EventListener>
      )
    } else {
      const coinClickHandler: CoinClickHandler = (coinData) => {
        this.props.history.push(`/news/${coinData.slug}`)
        this.setState({ ActiveMobileWindow: 'None' })
      }

      return (
        <EventListener
          target="window"
          onResize={this.handleResize}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
        >
          <LayoutDesktop
            leftSection={
              <CoinListWrapper
                isWatchlist={this.props.isWatchlistSelected}
                loggedIn={this.props.loggedIn}
              />
            }
            centerSection={
              <>
                <NewsListHeader
                  feedSources={this.props.feedSources}
                  topCoinSlugs={this.props.topCoinSlugs}
                  showFilters={this.state.showFilters}
                  toggleFilters={this.toggleFilters}
                  toggleNewsfeedTips={this.toggleTips}
                  applyFilters={this.applyFilters}
                  filters={this.state.filters}
                  categories={this.props.categories}
                  onCoinChange={this.onCoinChange}
                  selectedCoin={this.state.selectedCoin}
                />
                <NewsList
                  isShown={!this.state.showFilters}
                  isWindowFocused={this.state.isWindowFocused}
                  sortedNewsItems={this.props.newslist}
                  initialRenderTips={this.state.initialRenderTips}
                  isLoading={this.props.isNewsfeedLoading}
                  fetchMoreNewsFeed={() =>
                    this.props.fetchMoreNewsItems(this.state.filters)
                  }
                  closeTips={this.closeTips}
                  selectedNewsItemId={this.props.newsItemId}
                  onNewsItemClick={(newsItem: NewsItem) => {
                    this.props.history.push(
                      `/news/${newsItem.id}/${slugify(newsItem.title)}`,
                    )
                    this.setState({ ActiveMobileWindow: 'BodySection' })
                  }}
                  onCoinClick={coinClickHandler}
                  hasMore={this.props.hasMore}
                />
              </>
            }
            rightSection={
              <BodySection
                coinSlug={this.props.coinSlug}
                newsItemId={this.props.newsItemId}
                initialNewsItem={this.props.initialNewsItem}
                initialCoinWithDetails={this.props.initialCoinWithDetails}
                contentType={this.getContentType()}
                loggedIn={this.props.loggedIn}
                onCoinClick={coinClickHandler}
              />
            }
          />
        </EventListener>
      )
    }
  }
}

export default withDevice(withRouter<Props>(NewsfeedPage))
