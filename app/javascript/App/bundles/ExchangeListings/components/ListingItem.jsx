import React from 'react'

const ListingItem = (props) => {
  const { listing } = props
  return (
    <div className="b--b tiber flex flex-auto">
      <div className="fl w-third pa2">
        <h3>{listing.symbol}</h3>
      </div>
      <div className="fl w-third pa2">{listing.exchange_name}</div>
      <div className="fl w-third pa2">{listing.detected_at}</div>
    </div>
  )
}

export default ListingItem
