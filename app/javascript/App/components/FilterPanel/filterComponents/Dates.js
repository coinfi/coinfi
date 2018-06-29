import React, { Fragment } from 'react'
import Type from 'prop-types'
import ItemSelectorDate from '../../ItemSelectorDate'

// dates
const Dates = ({ dates, value, onChange }) => (
  <Fragment>

  <ItemSelectorDate
    items={dates}
    selectedItems={value}
    onChange={onChange('categories')}
  />
  </Fragment>
)

// Categories.propTypes = {
//   value: Type.object,
//   categories: Type.array.isRequired,
//   onChange: Type.func
// }

export default Dates
