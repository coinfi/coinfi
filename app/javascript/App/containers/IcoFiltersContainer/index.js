import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import {} from './actions'
import * as selectors from './selectors'

export default Component => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} />
    }
  }
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({}, dispatch)
    }
  }
  const mapState = createStructuredSelector({})
  return connect(mapState, mapDispatch)(HOC)
}
