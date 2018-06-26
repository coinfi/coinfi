import React from 'react'
import Type from 'prop-types'
import ItemSelector from '../../ItemSelectorAlt'

const FeedSources = ({ feedSources, value, onChange }) => {
  const sortedSources = _.sortBy(feedSources.map(item => {
    return item.replace('www.', '')
  }))
  return (
    <ItemSelector
      items={sortedSources}
      selectedItems={value}
      onChange={onChange('feedSources')}
    />
  )
}

FeedSources.propTypes = {
  value: Type.object,
  feedSources: Type.array.isRequired,
  onChange: Type.func
}

export default FeedSources
