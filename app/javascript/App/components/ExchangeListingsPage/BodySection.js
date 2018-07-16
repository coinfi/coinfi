import React from 'react'
import ListingBody from './ListingBody'
import CoinBody from '../NewsfeedPage/CoinBody'
import Tips from './Tips'

const BodySection = (props) => {
  const { activeEntity } = props
  if (!activeEntity) return <Tips {...props} />
  if (activeEntity.type === 'coin') return <CoinBody {...props} />
  return <ListingBody {...props} />
}

export default BodySection
