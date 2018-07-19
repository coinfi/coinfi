import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const CoinIndustries = ({ industries, value, onChange }) => (
  <ItemSelector items={industries} selectedItems={value} onChange={onChange} />
)

CoinIndustries.propTypes = {
  value: Type.array,
  industries: Type.array.isRequired,
  onChange: Type.func
}

export default CoinIndustries
