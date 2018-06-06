import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelector'

const FeedSources = ({ feedSources, value, onChange }) => (
  <ItemSelector items={feedSources} selectedItems={value} onChange={onChange} />
)

FeedSources.propTypes = {
  value: Type.array,
  feedSources: Type.array.isRequired,
  onChange: Type.func
}

export default FeedSources
