import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const Categories = ({ filterData, value, onChange }) => (
  <ItemSelector
    items={filterData.categories}
    selectedItems={value}
    onChange={onChange}
  />
)

Categories.propTypes = {
  value: Type.array,
  filterData: Type.object.isRequired,
  onChange: Type.func
}

export default Categories
