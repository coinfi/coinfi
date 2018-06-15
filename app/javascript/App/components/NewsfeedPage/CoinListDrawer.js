import React from 'react'
import Drawer from '../Drawer'
import CoinList from './CoinList'
import Icon from '../Icon'

const CoinListDrawer = (props) => {
  const closeDrawer = () => {
    props.toggleUI('coinListDrawer', {
      toggleBodyScroll: window.isMobile
    })
  }
  return (
    <Drawer uiKey="coinListDrawer" {...props} position="left" className="flex">
      <div className="flex-auto flex flex-column w-100 max-w20e bg-white">
        <CoinList {...props} />
      </div>
      <div className="flex-auto flex items-center ph4" onClick={closeDrawer}>
        <Icon name="times" className="f4 slate" regular />
      </div>
    </Drawer>
  )
}

export default CoinListDrawer
