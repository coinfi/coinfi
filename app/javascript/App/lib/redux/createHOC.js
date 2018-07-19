import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {createStructuredSelector} from 'reselect'

export default args => Component => {
  const {actions, selectors, onMount, extraProps, functions} = args
  class HOC extends React.Component {
    componentDidMount() {
      if (onMount) onMount(this)
    }
    componentWillMount() {
      this.thing = () => console.log('woot')
    }
    render() {
      let props = {...this.props}

      if (extraProps) Object.assign(props, extraProps)
      if (functions) {
        Object.keys(functions).forEach(funcName => {
          props[funcName] = functions[funcName](this)
        })
      }
      return <Component {...props} />
    }
  }
  const mapDispatch = dispatch => bindActionCreators(actions, dispatch)
  const mapState = createStructuredSelector(selectors)
  return connect(
    mapState,
    mapDispatch,
  )(HOC)
}
