
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

const STATUSES = {
  LOADING: 'LOADING',
  INFINITE_SCROLL_LOADING: 'INFINITE_SCROLL_LOADING',
  READY: 'READY',
}

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
  fetchNewsItemsForCoin: (coinSlug: string) => Promise<any>,
  fetchAllNewsItems: () => Promise<any>, 
  fetchMoreNewsItems: () => Promise<any>,
  fetchNewNewsItems: () => Promise<any>,
};

interface State {
  initialRenderTips: boolean,
  newsfeedTips: boolean,
  unseenNews: number[],
};

class NewsfeedPage extends React.Component<Props, State> {

  private newNewsItemsLoadingTimout = null;
  private documentTitle = document.title;
  private tmpVar = [];
  private timoutVar = null;

  state = {
    initialRenderTips: false,
    newsfeedTips: true,
    unseenNews: [],
    isWindowFocused: true,
  }

  // resetFetchNewNewsItems = () => {
  //   clearTimeout(this.newNewsItemsLoadingTimout);
  //   this.newNewsItemsLoadingTimout = setTimeout(() => {
  //     this.props.fetchNewNewsItems().then(() => this.resetFetchNewNewsItems())
  //   });
  // }

  updateTitle = () => {
    if (this.state.unseenNews.length === 0) {
      document.title = this.documentTitle;
    } else {
      document.title = this.state.unseenNews.length + ' | ' + this.documentTitle;
    }
  }

  onNewsItemShown = (id) => {
    // Question: is there way to accumulate/debounce function calls to do one function call with merged arguments?
    // this timout way looks dirty
    if(this.timoutVar !== null) clearTimeout(this.timoutVar);
    if(this.tmpVar === null) this.tmpVar = [];

    this.tmpVar.push(id);

    this.timoutVar = setTimeout(() => {
      this.setState({
        unseenNews: this.state.unseenNews.filter(_id => !this.tmpVar.includes(_id))
      }, () => this.updateTitle())
      this.timoutVar = null;
      this.tmpVar = null;
    }, 250);
  }

  fetchNewNewsItems = () => {
    this.props.fetchNewNewsItems().then(news => {
      if (!this.state.isWindowFocused) {
        const ids = news.map(elem => elem.id)
        this.setState({
          unseenNews: _.uniq(this.state.unseenNews.concat(ids))
        }, this.updateTitle)
      }
    })
  }

  handleResize = debounce(() => this.forceUpdate(), 500)

  handleOnBlur = () => this.setState({ isWindowFocused: false })
  
  handleOnFocus = () => this.setState({ isWindowFocused: true }, () => this.updateTitle())

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
    window.addEventListener('blur', this.handleOnBlur);
    window.addEventListener('focus', this.handleOnFocus);

    window.fetchNewNewsItems = () => { 
      setTimeout(() => {
        this.fetchNewNewsItems()
      }, 2000);
    }

    // this.newNewsItemsLoadingTimout = setTimeout(this.resetFetchNewNewsItems, 6000);

    if (this.getContentType() === "coin") {
        this.props.fetchNewsItemsForCoin(this.props.coinSlug);
    } else {
      if (this.props.newslist.length > 0) {
        return;
      }
      this.props.fetchAllNewsItems();
    }
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('blur', this.handleOnBlur);
    window.removeEventListener('focus', this.handleOnFocus);
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
                  isWindowFocused={this.state.isWindowFocused}
                  isLoading={this.props.isNewsfeedLoading}
                  isInfiniteScrollLoading={this.props.isNewsfeedLoadingMoreItems}
                  // @ts-ignore FIXME
                  activeFilters={this.state.activeFilters}
                  sortedNewsItems={this.props.newslist}
                  initialRenderTips={this.state.initialRenderTips}
                  fetchMoreNewsFeed={this.props.fetchMoreNewsItems}
                  closeTips={this.closeTips}
                  onNewsItemShown={(id) => this.onNewsItemShown(id)}
                  unseenNews={this.state.unseenNews}
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
