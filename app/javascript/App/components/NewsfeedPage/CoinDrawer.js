import React, { Fragment } from 'react'
import CoinList from './CoinList'
import Icon from '../Icon'

const CoinDrawer = (props) => (
  <Fragment>
    <button
      className="btn btn-blue btn-xs"
      onClick={() => props.toggleUI('coinDrawer')}
    >
      <Icon name="list" className="mr2" />
      Coin list
    </button>
    {props.currentUI('coinDrawer') && (
      <div className="drawer">
        <CoinList {...props} />
      </div>
    )}
  </Fragment>
)

export default CoinDrawer
