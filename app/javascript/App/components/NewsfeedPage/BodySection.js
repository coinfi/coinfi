import React from 'react'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Tips from './Tips'

const BodySection = (props) => {
  const { activeEntity } = props
  if (!activeEntity) return <Tips />
  if (activeEntity.type === 'coin') return <CoinBody {...props} />
  return <NewsItemBody {...props} />
}

export default BodySection
