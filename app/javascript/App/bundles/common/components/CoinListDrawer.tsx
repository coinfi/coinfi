import * as React from 'react'
import Drawer from './Drawer'
import Icon from './Icon'
import CoinListWrapper from '~/bundles/common/components/CoinListWrapper'

const CoinListDrawer = (props) => (
  <Drawer {...props} position="left" className="flex" onClose={props.onClose}>
    <div className="flex-auto flex flex-column w-100 max-w20e bg-white">
      <CoinListWrapper
        loggedIn={props.loggedIn}
        isWatchlist={props.isWatchlist}
        onClick={props.onClick}
      />
    </div>
    <div className="flex-auto flex items-center ph4" onClick={props.onClose}>
      <Icon name="times" className="f4 slate" styleType="regular" />
    </div>
  </Drawer>
)

export default CoinListDrawer
