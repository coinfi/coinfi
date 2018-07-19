import React from 'react'
import NewsBody from './NewsBody'
import CoinBody from './CoinBody'
import TwitterBody from './TwitterBody'
import Tips from './Tips'

const BodySection = props => {
  const {activeEntity} = props
  if (!activeEntity) return <Tips {...props} />
  if (activeEntity.type === 'coin') return <CoinBody {...props} />
  if (activeEntity.type === 'twitterNews') return <TwitterBody {...props} />
  return <NewsBody {...props} />
}

export default BodySection
