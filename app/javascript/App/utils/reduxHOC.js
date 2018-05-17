import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'

export default ({ actions, selectors, onMount, extraProps }) => (Component) => {
  class HOC extends React.Component {
    componentDidMount() {
      if (onMount) onMount(this)
    }
    render() {
      let props = { ...this.props }
      if (extraProps) Object.assign(props, extraProps)
      return <Component {...props} />
    }
  }

  const mapDispatch = (dispatch) => bindActionCreators(actions, dispatch)
  const mapState = createStructuredSelector(selectors)
  return connect(mapState, mapDispatch)(HOC)
}
