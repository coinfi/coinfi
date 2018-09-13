import * as React from 'react'
import _ from 'lodash'
import ItemSelector from '../components/ItemSelector'

interface Props {
  feedSources: string[]
  selectedItems: string[]
  onChange: (item: string) => void
}

const FeedSources = (props: Props) => {
  const sortedSources = _.sortBy(
    props.feedSources.map((item) => {
      if (/www/.exec(item) !== null) {
        return item.replace('www.', '').concat('.www')
      }
      return item.replace('www.', '')
    }),
  )
  const sourcesSansSocial = sortedSources.filter(
    (source) => source !== 'twitter' && source !== 'reddit',
  )
  return (
    <ItemSelector
      items={sourcesSansSocial}
      selectedItems={props.selectedItems}
      onChange={props.onChange}
    />
  )
}

export default FeedSources
