import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelectorAlt'

const Categories = ({ categories, value, onChange }) => (
  <ItemSelector
    items={categories}
    selectedItems={value}
    onChange={onChange('categories')}
  />
)

Categories.propTypes = {
  value: Type.array,
  categories: Type.array.isRequired,
  onChange: Type.func
}

export default Categories
