import React from 'react'
import WatchButton from './WatchButton'

export default props => {
  const { category, selectCategory, searchCoins, searchedCoins } = props
  const buttonProps = name => ({
    onClick: () => selectCategory(name),
    className: `tab ${name === category ? 'tab-active' : ''}`
  })
  return (
    <div>
      <div className="bg-white">
        <div className="tabs tabs-alt">
          <button {...buttonProps('listed')}>Listed Coins</button>
          <button {...buttonProps('ico')}>ICO</button>
        </div>
        <div className="pa3">
          <input
            type="text"
            onChange={({ target: { value } }) => searchCoins(value)}
            className="input-alt tc"
            placeholder="Search"
          />
        </div>
      </div>
      {searchedCoins.size > 0 && (
        <div>
          {searchedCoins.map(coin => (
            <div key={coin.get('id')} className="pb3 mb3 bb b--athens-dark">
              {coin.get('name')}
              <WatchButton coinID={coin.get('id')} noFetch />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
