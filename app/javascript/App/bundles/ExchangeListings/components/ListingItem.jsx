import React from 'react'

const ListingItem = (props) => {
  const { listing } = props
  return (
    <div className="b--b tiber flex flex-auto">
      <div className="fl w-third pa3">
        <h3 className="ma0">{listing.symbol}</h3>
      </div>
      <div className="fl w-third pa3">{listing.exchange_name}</div>
      <div className="fl w-third pa3">{listing.detected_at}</div>
    </div>
  )
}

export default ListingItem
