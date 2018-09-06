// TODO: find more convenient way to extend window declaration
import { IWindowScreenType, ICoinLinkData } from '../common/types'
declare const window: IWindowScreenType

import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import debounce from 'debounce'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '../../components/LayoutMobile'
import CoinListWrapper from '../common/components/CoinListWrapper'
import CoinListDrawer from '../../components/CoinList/CoinListDrawer'
import NewsList from './NewsList'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'
import BodySectionDrawer from '../../components/BodySectionDrawer'
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
}

interface IState {
  filters: IFilters
  initialRenderTips: boolean
  isWindowFocused: boolean
  newsfeedTips: boolean
  showFilters: boolean
  unseenNewsIds: number[]
}

class NewsfeedPage extends React.Component<IProps, IState> {
  public state = {
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
      this.setState((state, props) => {
        state.filters.coinSlugs.push(props.coinSlug)
        this.props.fetchNewsItems(state.filters).then(() => {
          this.startPollingNews()
        })
        return state
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
        this.setState((state) => {
          state.filters.coinSlugs = [this.props.coinSlug]
          this.props.fetchNewsItems(state.filters)
          return state
        })
      }
    }
  }

  public closeTips = () => {
    this.setState({ initialRenderTips: false })
  }

  public toggleFilters = () => {
    this.setState({ showFilters: !this.state.showFilters })
  }

  public render() {
    if (window.isMobile) {
      return (
        <LayoutMobile
          mainSection={
            <React.Fragment>
              {/* <NewsListHeader />
              <NewsList /> */}
            </React.Fragment>
          }
          modalName="newsfeedModal"
          // @ts-ignore
          modalSection={<BodySection />}
          drawerSection={
            <>
              {/* <CoinListDrawer />
              <BodySectionDrawer bodySection={<BodySection />} /> */}
            </>
          }
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          leftSection={
            <>{/* <NewsListHeader />
              <NewsList /> */}</>
          }
          // @ts-ignore
          rightSection={<BodySection />}
          drawerSection={<CoinListDrawer />}
        />
      )
    } else {
      return (
        <LayoutDesktop
          leftSection={<CoinListWrapper loggedIn={this.props.loggedIn} />}
          centerSection={
            <>
              <NewsListHeader
                feedSources={this.props.feedSources}
                showFilters={this.state.showFilters}
                toggleFilters={this.toggleFilters}
                // @ts-ignore
                newsfeedTips={this.state.newsfeedTips}
                applyFilters={this.applyFilters}
                filters={this.state.filters}
                categories={this.props.categories}
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
              />
            </>
          }
          rightSection={
            <BodySection
              coinSlug={this.props.coinSlug}
              newsItemId={this.props.newsItemId}
              contentType={this.getContentType()}
              // @ts-ignore
              loggedIn={this.props.loggedIn}
            />
          }
        />
      )
    }
  }
}

export default withRouter<IProps>(NewsfeedPage)
