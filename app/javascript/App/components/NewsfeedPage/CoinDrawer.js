import React, { Component } from 'react'
import Swipeable from 'react-swipeable'
import Animate from 'react-move/Animate'
import { easeExpOut } from 'd3-ease'
import CoinList from './CoinList'
import Icon from '../Icon'

const CoinDrawer = (props) => (
  <div className="dn-l">
    <button
      className="btn btn-blue btn-xs"
      onClick={() => props.toggleUI('coinDrawer')}
    >
      <Icon name="list" className="mr2" />
      Coin list
    </button>
    <Animate
      show={!!props.currentUI('coinDrawer')}
      start={{ translateX: ['-100%'] }}
      enter={{
        translateX: ['0%'],
        timing: { duration: 700, ease: easeExpOut }
      }}
      leave={{
        translateX: ['-100%'],
        timing: { duration: 200 }
      }}
    >
      {(animationProps) => <CoinDrawerList {...props} {...animationProps} />}
    </Animate>
  </div>
)

class CoinDrawerList extends Component {
  onSwipeLeft = () => {
    this.props.toggleUI('coinDrawer')
  }
  //
  render() {
    return (
      <Swipeable onSwipingLeft={this.onSwipeLeft}>
        <div
          className="drawer flex flex-column"
          style={{ transform: `translateX(${this.props.translateX})` }}
        >
          <CoinList {...this.props} />
        </div>
      </Swipeable>
    )
  }
}

export default CoinDrawer
