import React from 'react'

export default ({ coin }) => {
  return (
    <div className="pa4">
      <div className="flex items-center mb3">
        {coin.image_url && (
          <img className="w4e mr3 a1" src={coin.image_url} alt={coin.name} />
        )}
        <h1 className="ma0 lh-solid">
          <span className="fw4">{coin.name}</span>
          <span className="ml3 f6 fw9 arial">{coin.symbol}</span>
        </h1>
      </div>
      <div className="f3" />
    </div>
  )
}
