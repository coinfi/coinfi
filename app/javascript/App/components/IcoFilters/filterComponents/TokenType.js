import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const TokenType = ({ tokenTypes, value, onChange }) => (
  <ItemSelector items={tokenTypes} selectedItems={value} onChange={onChange} />
)

TokenType.propTypes = {
  value: Type.array,
  tokenTypes: Type.array.isRequired,
  onChange: Type.func
}

export default TokenType
