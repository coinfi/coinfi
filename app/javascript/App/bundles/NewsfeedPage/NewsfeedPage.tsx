
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
import _ from 'lodash'

import { NewsItem, ContentType } from './types';
import { CoinList, Coin } from '../common/types';

const POLLING_TIMEOUT = 6000;

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
  fetchNewsItemsForCoin: (coinSlug: string) => Promise<NewsItem[]>,
  fetchAllNewsItems: () => Promise<NewsItem[]>, 
  fetchMoreNewsItems: () => Promise<NewsItem[]>,
  fetchNewNewsItems: () => Promise<NewsItem[]>,
};

interface State {
  initialRenderTips: boolean,
  newsfeedTips: boolean,
  unseenNewsIds: number[],
  isWindowFocused: boolean,
};

class NewsfeedPage extends React.Component<Props, State> {

  private documentTitle = document.title;

  state = {
    initialRenderTips: false,
    newsfeedTips: true,
    unseenNewsIds: [],
    isWindowFocused: true,
  }

  startPollingNews = () => {
    setTimeout(() => {
      this.fetchNewNewsItems().then(() => {
        this.startPollingNews();
      })
    }, POLLING_TIMEOUT)
  }

  updateTitle = (news?: NewsItem[]) => {
    if(typeof news !== 'undefined') {
      if (news.length === 0) return;
      document.title = news.length + ' | ' + this.documentTitle;
      return;
    }

    if (!this.state.unseenNewsIds.length) {
      document.title = this.documentTitle;
    } else {
      document.title = this.state.unseenNewsIds.length + ' | ' + this.documentTitle;
    }
  }

  onNewsItemShown = (id) => {
    setTimeout(() => {
      this.setState(state => ({ unseenNewsIds: state.unseenNewsIds.filter(_id => _id !== id) }), this.updateTitle);
    }, 500)
  }

  fetchNewNewsItems = () => {
    return this.props.fetchNewNewsItems().then(news => {
      return new Promise((resolve, _reject) => {
        if (!this.state.isWindowFocused) {
          const ids = news.map(elem => elem.id)
          const unseenNewsIds = _.uniq(this.state.unseenNewsIds.concat(ids))
          this.updateTitle(unseenNewsIds);
          this.setState({
            unseenNewsIds,
            }, () => {
              resolve();
            })
          } else {
            resolve();
        }
      })
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

    if (!document.hasFocus()) {
      this.setState({ isWindowFocused: false })
    }

    if (this.getContentType() === "coin") {
        this.props.fetchNewsItemsForCoin(this.props.coinSlug).then(() => {
          this.startPollingNews();
        });
    } else {
      if (this.props.newslist.length > 0) {
        return;
      }
      this.props.fetchAllNewsItems().then(() => {
        this.startPollingNews();
      });
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
                  unseenNewsIds={this.state.unseenNewsIds}
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
