import React, { Fragment } from 'react'
import Type from 'prop-types'
import ItemSelectorDate from '../../ItemSelectorDate'

// dates
const Dates = ({ dates, value, onChange }) => (
  <Fragment>

  <ItemSelectorDate
    items={dates}
    selectedItems={value}
    onChange={onChange('dates')}
  />
  </Fragment>
)

export default Dates
