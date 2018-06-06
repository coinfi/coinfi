import React from 'react'
import Filters from '../Filters'

export default (props) => {
  const { coins, feedSources } = props
  return (
    <div id="site-subheader" className="flex-none">
      <div className="container-wide ph4 pb4">
        <div className="flex items-center">
          <div>
            <h1>CoinFi News</h1>
          </div>
          <div className="pl4">
            <Filters {...props} filterData={{ coins, feedSources }} />
          </div>
        </div>
      </div>
    </div>
  )
}
