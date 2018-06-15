import React from 'react'
import Drawer from '../Drawer'
import CoinList from './CoinList'

const CoinListDrawer = (props) => (
  <Drawer uiKey="coinListDrawer" {...props} position="left">
    <div className="absolute top-0 left-0 bottom-0 flex flex-column w-50 w-30-m bg-white">
      <CoinList {...props} />
    </div>
  </Drawer>
)

export default CoinListDrawer
