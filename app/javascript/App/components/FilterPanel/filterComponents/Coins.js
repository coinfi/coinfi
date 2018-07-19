import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelectorAlt'

const CoinSelector = ({filterData, value, onChange}) => {
  return (
    <ItemSelector
      items={filterData.coins}
      selectedItems={value}
      onChange={onChange('coins')}
    />
  )
}

CoinSelector.propTypes = {
  value: Type.array,
  filterData: Type.object.isRequired,
  onChange: Type.func,
}

export default CoinSelector
