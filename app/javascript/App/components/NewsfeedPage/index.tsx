import * as React from 'react'
import { withRouter } from 'react-router'
import debounce from 'debounce'
//import newsfeedContainer from '../../containers/newsfeed'
import LayoutDesktop from '../LayoutDesktop'
import LayoutTablet from '../LayoutTablet'
import LayoutMobile from '../LayoutMobile'
import CoinListWrapper from '../../bundles/common/components/CoinListWrapper'
import CoinListDrawer from '../CoinList/CoinListDrawer'
import NewsListContainer from './NewsListContainer'
import NewsList from './NewsList'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'
import BodySectionDrawer from '../BodySectionDrawer'
import CoinListContext from '../../contexts/CoinListContext'
import _ from 'lodash'
import localAPI from '../../lib/localAPI'

import { NewsItem } from './types';

const STATUSES = {
  LOADING: 'Loading',
  READY: 'Ready',
}

interface Props {
  newsItemSlug: string | null,
  newsItemId: string | null,
  match: any,
};

interface State {
  initialRenderTips: boolean,
  liveCoinArr: Array<any>,
  newsItemSlug: string | null, 
  status: string,
  newsfeedTips: boolean,
  newsItems: Array<NewsItem>,
  coinSlug: string,
};

class NewsfeedPage extends React.Component<Props, State> {
  state = {
    initialRenderTips: false,
    liveCoinArr: [],
    newsItemSlug: this.props.newsItemSlug,
    status: STATUSES.READY,
    newsfeedTips: true,
    newsItems: [],
    coinSlug: this.props.match.params.coinSlug,
  }

  componentDidMount() {
    //console.log(this.props)
    const id = this.state.coinSlug
    if (id) {
      this.fetchNewsItemsForCoin(id)
    } else {
      this.fetchAllNewsItems()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
    if (this.state.coinSlug !== prevState.coinSlug) {
      this.setState(
        {
          status: STATUSES.LOADING,
        },
        () =>
          this.state.coinSlug === null
            ? this.fetchAllNewsItems()
            : this.fetchNewsItemsForCoin(this.state.coinSlug),
      )
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location, history } = props
    if (state.coinSlug === match.params.coinSlug) {
      return null
    } else {
      return { coinSlug: match.params.coinSlug }
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
      // addCoinsToWatchlist: () => this.addCoinsToWatchlist.bind(this),
      // removeCoinsWatchlist: () => this.removeCoinsWatchlist.bind(this),
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
                    feedSources={feedSources}
                    showFilters={this.state.showFilters}
                    activeFilters={this.state.activeFilters}
                    newsfeedTips={this.state.newsfeedTips}
                  />
                  <NewsList
                    newsItems={this.state.newsItems}
                    isLoading={() => this.state.status === STATUSES.LOADING}
                    activeEntity={this.state.activeEntity}
                    activeFilters={this.state.activeFilters}
                    sortedNewsItems={sortedNewsItems}
                    initialRenderTips={this.state.initialRenderTips}
                  />
              </>
              )}
            </CoinListContext.Consumer>
          }
          rightSection={<BodySection {...enhancedProps} />}
        />
      )
    }
  }
}

export default withRouter(NewsfeedPage);
