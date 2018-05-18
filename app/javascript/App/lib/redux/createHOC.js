import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import createGenericActions from './createEntityActions'

export default (args) => (Component) => {
  const { namespace, actions, selectors, onMount, extraProps } = args
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

  let genericActions = {}
  if (namespace) genericActions = createGenericActions(namespace)
  const mapDispatch = (dispatch) =>
    bindActionCreators({ ...genericActions, ...actions }, dispatch)
  const mapState = createStructuredSelector(selectors)
  return connect(mapState, mapDispatch)(HOC)
}
