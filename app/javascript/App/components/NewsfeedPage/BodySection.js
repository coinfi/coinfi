import React from 'react'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Tips from './Tips'

const BodySection = (props) => {
  const { activeEntity } = props
  return (
    <div>
      {activeEntity ? (
        <div>
          {activeEntity.type === 'coin' ? (
            <CoinBody {...props} />
          ) : (
            <NewsItemBody {...props} />
          )}
        </div>
      ) : (
        <Tips />
      )}
    </div>
  )
}

export default BodySection
