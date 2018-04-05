import React from 'react'
import { arrayMove, SortableContainer } from 'react-sortable-hoc'
import WatchlistItem from './WatchlistItem'

const SortableWatchlist = SortableContainer(props => {
  const { entities, UI, coinIDs } = props
  const { coins } = entities.toObject()
  const { loading, editing } = UI.toObject()
  if (!loading && (!coins || coins.size === 0))
    return <div className="o-60 pt3 tc">Nothing added yet</div>
  return (
    <div>
      {coinIDs &&
        coinIDs.map((id, index) => (
          <WatchlistItem
            {...{
              ...props,
              index,
              key: id,
              coin: coins.get(`${id}`).toJS(),
              editing
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
    distance={10}
    axis="y"
    useDragHandle={true}
    onSortEnd={({ oldIndex, newIndex }) => {
      const { reorderCoins, coinIDs } = props
      reorderCoins(arrayMove(coinIDs, oldIndex, newIndex))
    }}
  />
)
