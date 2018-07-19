import React from 'react'
import Type from 'prop-types'
import _ from 'lodash'
import ItemSelector from '../../ItemSelectorAlt'

const FeedSources = ({ feedSources, value, onChange }) => {
  const sortedSources = _.sortBy(feedSources.map((item) => {
    if (/www/.exec(item) !== null)
      return item.replace('www.', '').concat('.www')
    return item.replace('www.', '')
  }))
  let surfaceSocial = sortedSources.filter((source) => source !== 'twitter' && source !== 'reddit')
  surfaceSocial.unshift('reddit')
  surfaceSocial.unshift('twitter')
  return (
    <ItemSelector
      items={surfaceSocial}
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
