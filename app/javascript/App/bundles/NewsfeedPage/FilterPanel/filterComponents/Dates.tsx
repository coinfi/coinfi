import * as React from 'react'
import DateRange from '../../../../components/DateRange'

const Dates = ({ value, onChange }) => {
  return <DateRange selectedItems={value} onChange={onChange('dates')} />
}

export default Dates
