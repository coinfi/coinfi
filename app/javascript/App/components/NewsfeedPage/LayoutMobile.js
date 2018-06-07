import React, { Component } from 'react'
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

  componentDidMount() {
    setTimeout(()=>{
      // console.log(this.refs.test.offsetHeight) // 42
      console.log(window.offsetHeight) // 42
    },1)
  }

  setMargin() {
    console.log('setMargin', window.pageYOffset + 200)
    // this.setState({
    //   marginTopVal: window.pageYOffset + 200
    // })
  }

  render() {
    const { activeEntity, currentUI } = this.props
    return (
      <div>
        <div className="bg-white">
          <ActionBar {...this.props} />
          <NewsItemList {...this.props} />
        </div>
        {activeEntity && (
          <div className="overlay mobile" style={{marginTop: this.state.marginTopVal}}>
            <BodySection {...this.props} mobileLayout setMargin={this.setMargin} />
          </div>
        )}
      </div>
    )
  }
}
