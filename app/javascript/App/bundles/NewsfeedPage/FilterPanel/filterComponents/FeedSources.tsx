import * as React from 'react'
import * as _ from 'lodash'
import ItemSelector from '../components/ItemSelector'

interface Props {
  feedSources: string[]
  selectedItems: string[]
  onChange: (item: string) => void
}

const FeedSources = (props: Props) => {
  const sortedSources = _.sortBy(props.feedSources, (item) => {
    if (!item) {
      return item
    }
    return item.replace('www.', '')
  })
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
