import React from 'react'
import NewsBody from './NewsBody'
import CoinBody from './CoinBody'
import Tips from './Tips'

const BodySection = (props) => {
  const { activeEntity } = props
  console.log('BodySection props', props)
  if (!activeEntity) return <Tips />
  if (activeEntity.type === 'coin') return <CoinBody {...props} />
  return <NewsBody {...props} />
}

export default BodySection
