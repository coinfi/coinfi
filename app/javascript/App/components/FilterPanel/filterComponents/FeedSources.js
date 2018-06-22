import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelectorAlt'

const FeedSources = ({ feedSources, value, onChange }) => (
  <ItemSelector
    items={feedSources}
    selectedItems={value}
    onChange={onChange('feedSources')}
  />
)

FeedSources.propTypes = {
  value: Type.object,
  feedSources: Type.array.isRequired,
  onChange: Type.func
}

export default FeedSources
