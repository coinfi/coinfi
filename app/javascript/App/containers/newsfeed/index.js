import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { fetchNewsfeed } from './actions'
import * as selectors from './selectors'

export default Component => {
  class HOC extends React.Component {
    componentDidMount() {
      this.props.fetchNewsfeed()
    }
    render() {
      return <Component {...this.props} />
    }
  }

  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators(
        {
          fetchNewsfeed
        },
        dispatch
      )
    }
  }

  const mapState = createStructuredSelector({
    coins: selectors.selectCoins(),
    articles: selectors.selectArticles(),
    tags: selectors.selectTags()
  })

  return connect(mapState, mapDispatch)(HOC)
}
