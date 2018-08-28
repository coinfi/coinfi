import * as React from 'react'
import ItemSelectorCategory from '../../../../components/ItemSelectorCategory'

interface IProps {
  value: object
  categories: []
  onChange: () => void
}

const Categories = ({ categories, value, onChange }: IProps) => (
  <ItemSelectorCategory
    items={categories}
    selectedItems={value}
    onChange={onChange}
  />
)

export default Categories
