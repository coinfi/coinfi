import React, { Fragment } from 'react'
import Type from 'prop-types'
import ItemSelectorDate from '../../ItemSelectorDate'

const Dates = ({ dates, value, onChange }) => {
  return (
    <ItemSelectorDate
      items={dates}
      selectedItems={value}
      onChange={onChange('dates')}
    />
  )
}

export default Dates
