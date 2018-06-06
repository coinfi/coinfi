import React from 'react'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Tips from './Tips'

const BodySection = (props) => {
  const { activeEntity } = props
  if (!activeEntity) return <Tips />
  return (
    <div>
      {activeEntity.type === 'coin' ? (
        <CoinBody {...props} />
      ) : (
        <NewsItemBody {...props} />
      )}
    </div>
  )
}

export default BodySection
