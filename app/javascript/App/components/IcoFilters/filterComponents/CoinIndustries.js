import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const CoinIndustries = ({ industriesJson, value, onChange }) => (
  <ItemSelector
    items={industriesJson}
    selectedItems={value}
    onChange={onChange}
  />
)

CoinIndustries.propTypes = {
  value: Type.array,
  filterData: Type.object.isRequired,
  onChange: Type.func
}

export default CoinIndustries
