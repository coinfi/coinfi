import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { fetchEntity } from './actions'
import * as selectors from './selectors'

const Container = Page => {
  class HOC extends Component {
    id = window.location.pathname.split('/')[2]
    componentDidMount() {
      const { fetchEntity } = this.props
      fetchEntity(this.id)
    }
    render() {
      return <Page {...this.props} />
    }
  }

  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({ fetchEntity }, dispatch)
    }
  }

  const mapState = createStructuredSelector({
    entity: selectors.entity()
  })
  return connect(mapState, mapDispatch)(HOC)
}

export default Container
