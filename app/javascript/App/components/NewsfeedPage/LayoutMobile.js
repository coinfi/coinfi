import React, { Component, Fragment } from 'react'
import NewsItemList from './NewsItemList'
import BodySection from './BodySection'
import ActionBar from './ActionBar'

export default class LayoutMobile extends Component {

  constructor(props) {
    super()
    this.state = {
      marginTopVal: 0
    }
  }

  setMargin() {
    this.setState({
      marginTopVal: window.pageYOffset + 200
    })
  }

  render() {
    const { activeEntity, currentUI } = this.props
    const modalStyle = {
      height: 1000,
      width: '100%',
      background: '#333',
      opacity: '.8',
      top: 0,
      position: 'absolute'
    }
    return (
      <div>
        <div className="bg-white">
          <ActionBar {...this.props} />
          <NewsItemList {...this.props} setMargin={this.setMargin.bind(this)} />
        </div>
        {activeEntity &&
          currentUI('newsfeedModal') && (
          <Fragment>
            <div className="modal bg-black-70 pt5 vw100">
              <BodySection {...this.props} mobileLayout setMargin={this.setMargin} />
            </div>
            <div />
          </Fragment>
        )}
      </div>
    )
  }
}
