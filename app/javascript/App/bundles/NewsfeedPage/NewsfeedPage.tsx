
// TODO: find more convenient way to extend window declaration
import { WindowScreenType } from '../common/types';
declare const window: WindowScreenType;

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
import CoinListContext from '../../contexts/CoinListContext'
import _ from 'lodash'
import localAPI from '../../lib/localAPI'


import { NewsItem, ContentType } from './types';
import { CoinList, Coin } from '../common/types';

interface Props extends RouteComponentProps<any> {
  coinSlug?: string,
  newsItemId?: string,
  coinlist: CoinList,
  newslist: Array<NewsItem>,
  isNewsfeedLoading: boolean,
  isNewsfeedLoadingMoreItems: boolean,
  isNewsfeedReady: boolean,
  isCoinlistLoading: boolean,
  isCoinlistReady: boolean,
  fetchNewsItemsForCoin: (coinSlug: string) => void,
  fetchAllNewsItems: () => void, 
  fetchMoreNewsItems: () => any, 
};

interface State {
  initialRenderTips: boolean,
  newsfeedTips: boolean,
};

class NewsfeedPage extends React.Component<Props, State> {
  state = {
    initialRenderTips: false,
    newsfeedTips: true,
  }

  handleResize = debounce(() => this.forceUpdate(), 500)

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
    window.addEventListener('resize', this.handleResize)

    if (this.getContentType() === "coin") {
        this.props.fetchNewsItemsForCoin(this.props.coinSlug)
    } else {
      if (this.props.newslist.length > 0) {
        return;
      }
      this.props.fetchAllNewsItems();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.coinSlug !== prevProps.coinSlug) {
      this.props.fetchNewsItemsForCoin(this.props.coinSlug)
    }
  }

  closeTips = () => {
    this.setState({ initialRenderTips: false })
  }

  render() {
    if (window.isMobile) {
      return (
        <LayoutMobile
          mainSection={
            <React.Fragment>
              <NewsListHeader />
              <NewsList />
            </React.Fragment>
          }
          modalName="newsfeedModal"
          modalSection={<BodySection />}
          drawerSection={
            <>
              <CoinListDrawer />
              <BodySectionDrawer
                bodySection={<BodySection />}
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
              <NewsListHeader />
              <NewsList />
            </>
          }
          rightSection={<BodySection />}
          drawerSection={<CoinListDrawer />}
        />
      )
    } else {
      return (
        <LayoutDesktop
          leftSection={<CoinListWrapper />}
          centerSection={
              <>
                <NewsListHeader
                  coins={this.props.coinlist}
                  // @ts-ignore FIXME
                  feedSources={this.props.feedSources}
                  // @ts-ignore FIXME
                  showFilters={this.state.showFilters}
                  // @ts-ignore FIXME
                  activeFilters={this.state.activeFilters}
                  newsfeedTips={this.state.newsfeedTips}
                />
                <NewsList
                  isLoading={this.props.isNewsfeedLoading}
                  isInfiniteScrollLoading={this.props.isNewsfeedLoadingMoreItems}
                  // @ts-ignore FIXME
                  activeFilters={this.state.activeFilters}
                  sortedNewsItems={this.props.newslist}
                  initialRenderTips={this.state.initialRenderTips}
                  fetchMoreNewsFeed={this.props.fetchMoreNewsItems}
                  closeTips={this.closeTips}
                />
            </>
          }
          rightSection={
            <BodySection
              coinSlug={this.props.coinSlug}
              newsItemId={this.props.newsItemId}
              contentType={this.getContentType()}
              closeTips={this.closeTips} 
            />
          }
        />
      )
    }
  }
}

export default withRouter<Props>(NewsfeedPage);
