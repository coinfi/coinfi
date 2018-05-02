/*
 * Any selectors or actions defined here are made globally available.
 */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { currentUI } from './selectors'
import { toggleUI } from './actions'

export const app = Component => props => <Component {...props} />

const mapState = state => ({
  currentUI: currentUI(state)
})

const mapDispatch = dispatch => ({
  ...bindActionCreators({ toggleUI }, dispatch)
})

export default Component => connect(mapState, mapDispatch)(app(Component))
