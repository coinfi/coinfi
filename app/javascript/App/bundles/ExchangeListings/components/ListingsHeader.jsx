import React from 'react'

const ListingsHeader = (props) => {
  return (
    <div className="flex flex-auto f6 bg-athens b--b">
      <div className="w-third pb3 ma3">Pair</div>
      <div className="w-third pb3 ma3">Exchange</div>
      <div className="w-third pb3 ma3">Date Detected</div>
    </div>
  )
}

export default ListingsHeader
