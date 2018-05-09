import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const CountriesAllowed = ({ filterData, value, onChange }) => (
  <ItemSelector
    items={filterData.countries}
    selectedItems={value}
    onChange={onChange}
  />
)

CountriesAllowed.propTypes = {
  value: Type.array,
  filterData: Type.object.isRequired,
  onChange: Type.func
}

export default CountriesAllowed
