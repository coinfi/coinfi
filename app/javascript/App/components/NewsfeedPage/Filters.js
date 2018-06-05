import React from 'react'
import Filters from '../Filters'
import CoinDrawer from './CoinDrawer'

const NewsfeedFilters = (props) => {
  const { coins, feedSources } = props
  return (
    <div className="pa3 bb b--athens-dark flex justify-between items-center">
      <CoinDrawer {...props} />
      <div>Search</div>
      <Filters {...props} filterData={{ coins, feedSources }} layout="panel" />
    </div>
  )
}

export default NewsfeedFilters
