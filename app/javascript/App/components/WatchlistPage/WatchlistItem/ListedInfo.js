import React, { Fragment } from 'react'
import PercentageChange from '../../PercentageChange'
import Currency from '../../Currency'

export default ({ coin }) => {
  const { market_info: info } = coin
  return (
    <Fragment>
      <PercentageChange
        number={info.percent_change_24h}
        className="smaller2 b mr2"
      />
      <Currency>{info.price_usd}</Currency>
    </Fragment>
  )
}
