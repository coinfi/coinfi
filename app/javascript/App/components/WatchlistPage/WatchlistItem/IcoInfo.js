import React from 'react'
import numeral from 'numeral'

export default ({ coin }) => {
  return (
    <div className="flex items-center justify-end">
      <div className="green">
        {`$${numeral(coin.ico_usd_raised || 0).format('0,0')}`}
      </div>
      <div className="mh2 f7 ttu silver">of</div>
      <div>
        {`$${numeral(coin.ico_fundraising_goal_usd || 0).format('0,0')}`}
      </div>
    </div>
  )
}
