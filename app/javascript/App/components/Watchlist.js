import React from 'react'
import { arrayMove, SortableContainer } from 'react-sortable-hoc'
import WatchlistItem from './WatchlistItem'

const SortableWatchlist = SortableContainer(props => {
  const { entities, currentUI, coinIDs } = props
  const { coins } = entities.toObject()
  if (!currentUI('loading') && (!coins || coins.size === 0))
    return <div className="o-60 pv3 tc">Nothing added yet</div>
  return (
    <div>
      {coinIDs &&
        coinIDs.map((id, index) => (
          <WatchlistItem
            {...{
              ...props,
              index,
              key: id,
              coin: coins.get(`${id}`).toJS()
            }}
          />
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
    onSortEnd={({ oldIndex, newIndex }) => {
      const { reorderCoins, coinIDs } = props
      reorderCoins(arrayMove(coinIDs, oldIndex, newIndex))
    }}
  />
)
