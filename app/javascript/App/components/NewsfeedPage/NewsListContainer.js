import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import NewsListHeader from './NewsListHeader'
import NewsList from './NewsList'

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
  }

  componentDidMount() {
    const { match, location, history } = this.props
    console.log(this.props)
    const id = match.params.id
    if (id) {
      this.fetchNewsItemsForCoin(id)
    } else {
      this.fetchAllNewsItems()
    }
  }

  fetchAllNewsItems() {}

  fetchNewsItemsForCoin(coinName) {}

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
          isLoading={this.state.isLoading}
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
