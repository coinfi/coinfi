import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import NewsListHeader from './NewsListHeader'
import NewsList from './NewsList'
import localAPI from '../../lib/localAPI'

const STATUSES = {
  LOADING: 'Loading',
  READY: 'Ready',
}

class NewsListContainer extends Component {
  state = {
    status: STATUSES.LOADING,
    showFilters: false,
    activeFilters: null,
    activeEntity: null,
    newsfeedTips: true,
    initialRenderTips: true,
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
    const { coins, feedSources, sortedNewsItems } = this.props
    return this.state.status === STATUSES.LOADING ? (
      <div>Loading...</div>
    ) : (
      <Fragment>
        <NewsListHeader
          coins={coins}
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
      </Fragment>
    )
  }
}

export default withRouter(NewsListContainer)
