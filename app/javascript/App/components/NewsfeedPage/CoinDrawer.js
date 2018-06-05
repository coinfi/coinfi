import React, { Component, Fragment } from 'react'
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
      start={{ x: '-100%' }}
      enter={{
        x: ['0%'],
        timing: { duration: 700, ease: easeExpOut }
      }}
      leave={{
        x: ['-100%'],
        timing: { duration: 200 }
      }}
    >
      {({ x }) => <CoinDrawerList {...props} x={x} />}
    </Animate>
  </div>
)

class CoinDrawerList extends Component {
  onSwipeLeft = () => {
    this.props.toggleUI('coinDrawer')
  }
  render() {
    return (
      <Swipeable onSwipedLeft={this.onSwipeLeft}>
        <div
          className="drawer"
          style={{ transform: `translateX(${this.props.x})` }}
        >
          <CoinList {...this.props} />
        </div>
      </Swipeable>
    )
  }
}

export default CoinDrawer
