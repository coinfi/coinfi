import React from 'react'
import {arrayMove, SortableContainer} from 'react-sortable-hoc'
import WatchlistItem from './WatchlistItem'

const SortableWatchlist = SortableContainer(props => {
  const {coins, currentUI} = props
  if (!currentUI('loading') && (!coins || coins.size === 0))
    return <div className="o-60 pv3 tc">Nothing added yet</div>
  return (
    <div>
      {coins.map((coin, index) => (
        <WatchlistItem {...{...props, index, key: index, coin: coin.toJS()}} />
      ))}
    </div>
  )
})

export default props => (
  <SortableWatchlist
    {...props}
    lockToContainerEdges
    axis="y"
    pressDelay={200}
    onSortEnd={({oldIndex, newIndex}) => {
      const {reorderCoins, coinIDs} = props
      reorderCoins(arrayMove(coinIDs, oldIndex, newIndex))
    }}
  />
)
