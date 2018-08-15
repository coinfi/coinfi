
// TODO: find more convenient way to extend window declaration
import { WindowScreenType } from '../common/types';
declare const window: WindowScreenType;

import * as React from 'react'
import { withRouter } from 'react-router'
import debounce from 'debounce'
//import newsfeedContainer from '../../containers/newsfeed'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '../../components/LayoutMobile'
import CoinListWrapper from '../../bundles/common/components/CoinListWrapper'
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
  READY: 'Ready',
}

interface Props {
  coinSlug?: string,
  newsItemId?: string,
};

interface State {
  initialRenderTips: boolean,
  liveCoinArr: Array<any>,
  status: string,
  newsfeedTips: boolean,
  newsItems: Array<NewsItem>,
};

class NewsfeedPage extends React.Component<Props, State> {
  state = {
    initialRenderTips: false,
    liveCoinArr: [],
    status: STATUSES.READY,
    newsfeedTips: true,
    newsItems: [],
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
    if (this.getContentType() === "coin") {
      this.fetchNewsItemsForCoin(this.props.coinSlug);
    } else {
      this.fetchAllNewsItems()
    }
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
    return _.find(this.state.newsItems, ['id', parseInt(this.props.newsItemId)]);
  }

  getCoinInfo(coinList: CoinList): Coin {
    return _.find(coinList, ['slug', this.props.coinSlug]);
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

  fetchAllNewsItems() {
    localAPI.get('/news').then((response) => {
      //console.log(response)
      this.setState({
        status: STATUSES.READY,
        newsItems: response.payload,
      })
    })
  }

  fetchNewsItemsForCoin(coinSlug) {
    // TODO: Retrieve correct NewsItems.
    localAPI.get(`/news?coinSlugs=${coinSlug}`).then((response) => {
      //console.log(response)
      this.setState({
        status: STATUSES.READY,
        newsItems: response.payload,
      })
    })
  }

  render() {
    let enhancedProps = {
      ...this.props,
      // newsfeedTips: (event) => this.newsfeedTips(event),
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
            <CoinListContext.Consumer>
              {(payload) => (
                <>
                  <NewsListHeader
                    coins={payload.coinlist}
                    feedSources={this.props.feedSources}
                    showFilters={this.state.showFilters}
                    activeFilters={this.state.activeFilters}
                    newsfeedTips={this.state.newsfeedTips}
                  />
                  <NewsList
                    newsItems={this.state.newsItems}
                    isLoading={() => this.state.status === STATUSES.LOADING}
                    activeFilters={this.state.activeFilters}
                    sortedNewsItems={this.props.sortedNewsItems}
                    initialRenderTips={this.state.initialRenderTips}
                    fetchMoreNewsFeed={() => undefined} //TODO
                    toggleNewsfeedTips={this.toggleNewsfeedTips}
                  />
              </>
              )}
            </CoinListContext.Consumer>
          }
          rightSection={
            // Question Andrey: maybe wrap whole render function into CoinListContext ?
            <CoinListContext.Consumer>
              {
                (payload) => (
                  <BodySection
                    coinInfo={this.getCoinInfo(payload.coinlist)}
                    newsItem={this.getNewsItem()}
                    contentType={this.getContentType()}
                    closeTips={this.newsfeedTips} 
                  />
                )
              }
            </CoinListContext.Consumer>
          }
        />
      )
    }
  }
}

export default withRouter(NewsfeedPage);
