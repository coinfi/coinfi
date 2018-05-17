import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'

export default ({ actions, selectors, onMount }) => (Component) => {
  class HOC extends React.Component {
    componentDidMount() {
      if (onMount) onMount(this)
    }
    render() {
      return <Component {...this.props} />
    }
  }

  const mapDispatch = (dispatch) => bindActionCreators(actions, dispatch)
  const mapState = createStructuredSelector(selectors)
  return connect(mapState, mapDispatch)(HOC)
}
