import React from 'react'

const ListingsHeader = (props) => {
  return (
    <div className="flex flex-auto f6 bg-athens b--b">
      <div className="fl w-third pa2">Pair</div>
      <div className="fl w-third pa2">Exchange</div>
      <div className="fl w-third pa2">Date Detected</div>
    </div>
  )
}

export default ListingsHeader
