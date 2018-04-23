/*
 * Any selectors or actions defined here are made globally available.
 */
import React from 'react'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import * as selectors from './selectors'
import { toggleUI } from './actions'

export const app = Component => {
  return ({ ...props }) => {
    const { UI } = props
    return (
      <Component
        {...props}
        currentUI={(key, val = null) => {
          if (!val) return UI.get(key)
          return UI.get(key) === val
        }}
      />
    )
  }
}

const mapState = createStructuredSelector({
  UI: selectors.selectUI()
})

function mapDispatch(dispatch) {
  return {
    ...bindActionCreators({ toggleUI }, dispatch)
  }
}

export default Component => connect(mapState, mapDispatch)(app(Component))
