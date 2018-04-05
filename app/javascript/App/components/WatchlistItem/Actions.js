import React from 'react'

export default props => {
  const { removeCoin, coin } = props
  return (
    <div className="flex justify-end">
      <button className="btn btn-xs" onClick={() => removeCoin(coin.id)}>
        Remove
      </button>
    </div>
  )
}
