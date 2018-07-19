import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const ReviewedBy = ({influencers, value, onChange}) => (
  <ItemSelector items={influencers} selectedItems={value} onChange={onChange} />
)

ReviewedBy.propTypes = {
  value: Type.array,
  influencers: Type.array.isRequired,
  onChange: Type.func,
}

export default ReviewedBy
