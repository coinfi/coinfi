
// TODO: find more convenient way to extend window declaration
import { WindowScreenType } from '../common/types';
declare const window: WindowScreenType;

import * as React from 'react'
import { withRouter } from 'react-router'
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
import CoinListContext from '../../contexts/CoinListContext'
import _ from 'lodash'
import localAPI from '../../lib/localAPI'


import { NewsItem, ContentType } from './types';
import { CoinList, Coin } from '../common/types';

const STATUSES = {
  LOADING: 'Loading',
  INFINITE_SCROLL_LOADING: 'InfiniteScrollLoading',
  READY: 'Ready',
}

interface Props {
  coinSlug?: string,
  newsItemId?: string,
  coinList: CoinList,
};

interface State {
  initialRenderTips: boolean,
  liveCoinArr: Array<any>,
  status: string,
  newsfeedTips: boolean,
  sortedNewsItems: Array<NewsItem>,
};

class NewsfeedPage extends React.Component<Props, State> {
  state = {
    initialRenderTips: false,
    liveCoinArr: [],
    status: STATUSES.READY,
    newsfeedTips: true,
    sortedNewsItems: [],
  }

  getContentType(): ContentType {
    if (typeof this.props.coinSlug !== 'undefined') {
      return "coin";
    }

    if (typeof this.props.newsItemId !== 'undefined') {
      return "news";
    }

    return "none";
  }

  componentDidMount() {
    this.setState({
      status: STATUSES.LOADING
    },
    () => {
    if (this.getContentType() === "coin") {
        this.fetchNewsItemsForCoin(this.props.coinSlug);
    } else {
      this.fetchAllNewsItems()
    }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    window.addEventListener('resize', debounce(() => this.forceUpdate(), 500))

    if (this.props.coinSlug !== prevProps.coinSlug) {
      this.setState(
        {
          status: STATUSES.LOADING,
        },
        () =>
          this.props.coinSlug === undefined
            ? this.fetchAllNewsItems()
            : this.fetchNewsItemsForCoin(this.props.coinSlug),
      )
    }
  }

  toggleNewsfeedTips() {
    this.setState({ initialRenderTips: !this.state.initialRenderTips })
  }

  getNewsItem(): NewsItem | undefined {
    return _.find(this.state.sortedNewsItems, ['id', parseInt(this.props.newsItemId)]);
  }

  getCoinInfo(): Coin {
    return _.find(this.props.coinList, ['slug', this.props.coinSlug]);
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location, history } = props
    if (state.coinSlug === match.params.coinSlug 
      && state.newsItemId === props.newsItemId) {
      return null
    } else {
      return { coinSlug: match.params.coinSlug, newsItemId: props.newsItemId }
    }
  }

  sortNewsFunc(x: NewsItem, y: NewsItem) {
    return Date.parse(y.feed_item_published_at) - Date.parse(x.feed_item_published_at)
  }

  fetchAllNewsItems() {
    localAPI.get('/news').then((response) => {
      this.setState({
        status: STATUSES.READY,
        sortedNewsItems: response.payload.sort(this.sortNewsFunc),
      })
    })
  }

  fetchNewsItemsForCoin(coinSlug) {
    // TODO: Retrieve correct NewsItems.
    localAPI.get(`/news?coinSlugs=${coinSlug}`).then((response) => {
      this.setState({
        status: STATUSES.READY,
        sortedNewsItems: response.payload.sort(this.sortNewsFunc),
      })
    })
  }

  fetchMoreNewsItems = () => {
    const lastNews = this.state.sortedNewsItems[this.state.sortedNewsItems.length - 1];
    this.setState({
      status: STATUSES.INFINITE_SCROLL_LOADING
    });

    localAPI.get(`/news`, { publishedUntil: lastNews.publishedUntil }).then(response => {
        this.setState({
          status: STATUSES.READY,
          sortedNewsItems: [...this.state.sortedNewsItems, ...response.payload.sort(this.sortNewsFunc)]
        })
    });
  }

  render() {
    let enhancedProps = {
      ...this.props,
      initialRenderTips: this.state.initialRenderTips,
    }

    if (window.isMobile) {
      return (
        <LayoutMobile
          {...enhancedProps}
          mainSection={
            <React.Fragment>
              <NewsListHeader {...enhancedProps} />
              <NewsList {...enhancedProps} />
            </React.Fragment>
          }
          modalName="newsfeedModal"
          modalSection={<BodySection {...enhancedProps} mobileLayout />}
          drawerSection={
            <>
              <CoinListDrawer {...enhancedProps} />
              <BodySectionDrawer
                {...enhancedProps}
                bodySection={<BodySection {...enhancedProps} />}
              />
            </>
          }
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          {...enhancedProps}
          leftSection={
            <>
              <NewsListHeader {...enhancedProps} />
              <NewsList {...enhancedProps} />
            </>
          }
          rightSection={<BodySection {...enhancedProps} />}
          drawerSection={<CoinListDrawer {...enhancedProps} />}
        />
      )
    } else {
      return (
        <LayoutDesktop
          {...enhancedProps}
          leftSection={<CoinListWrapper {...enhancedProps} />}
          centerSection={
              <>
                <NewsListHeader
                  coins={this.props.coinList}
                  feedSources={this.props.feedSources} // TODO: what is that?
                  showFilters={this.state.showFilters}
                  activeFilters={this.state.activeFilters}
                  newsfeedTips={this.state.newsfeedTips}
                />
                <NewsList
                  isLoading={() => this.state.status === STATUSES.LOADING}
                  isInfiniteScrollLoading={() => this.state.status === STATUSES.INFINITE_SCROLL_LOADING}
                  activeFilters={this.state.activeFilters}
                  sortedNewsItems={this.state.sortedNewsItems} // TODO: where they come from?
                  initialRenderTips={this.state.initialRenderTips}
                  fetchMoreNewsFeed={this.fetchMoreNewsItems} //TODO
                  toggleNewsfeedTips={this.toggleNewsfeedTips}
                />
            </>
          }
          rightSection={
            <BodySection
              coinInfo={this.getCoinInfo()}
              newsItem={this.getNewsItem()}
              contentType={this.getContentType()}
              closeTips={this.newsfeedTips} 
            />
          }
        />
      )
    }
  }
}

export default withRouter(NewsfeedPage);
