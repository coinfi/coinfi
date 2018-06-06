import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const Categories = ({ categories, value, onChange }) => (
  <ItemSelector items={categories} selectedItems={value} onChange={onChange} />
)

Categories.propTypes = {
  value: Type.array,
  categories: Type.array.isRequired,
  onChange: Type.func
}

export default Categories
