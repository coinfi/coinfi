import * as React from 'react'
import ItemSelector from '../../../../components/ItemSelectorAlt'

interface IProps {
  value: []
  filterData: any
  onChange: () => void
}

const CoinSelector = ({ filterData, value, onChange }: IProps) => {
  return (
    <ItemSelector
      items={filterData.coins}
      selectedItems={value}
      onChange={onChange}
    />
  )
}

export default CoinSelector
