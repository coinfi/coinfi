import React from 'react'
import Type from 'prop-types'
import ItemSelectorCategory from '../../ItemSelectorCategory'

const Categories = ({ categories, value, onChange }) => (
  <ItemSelectorCategory
    items={categories}
    selectedItems={value}
    onChange={onChange('categories')}
  />
)

Categories.propTypes = {
  value: Type.object,
  categories: Type.array.isRequired,
  onChange: Type.func
}

export default Categories
