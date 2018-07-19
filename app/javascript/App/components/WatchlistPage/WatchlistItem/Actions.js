import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'

export default SortableHandle((props) => {
  const { removeCoin, coin } = props
  return (
    <div className="flex justify-end">
      <button
        className="btn btn-xs btn-white mr2 no-wrap"
        onClick={() => removeCoin(coin.id)}
      >
        <i className="fal fa-trash mr2" />
        Remove
      </button>
      <div className="btn btn-xs btn-white cursor-move no-wrap">
        <i className="fal fa-arrows-alt mr2" />
        Reposition
      </div>
    </div>
  )
})
