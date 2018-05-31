import React from 'react'
import timeago from 'timeago.js'

export default ({
  newsItem,
  selectNewsItemCoins,
  setActiveEntity,
  activeEntity
}) => {
  const coins = selectNewsItemCoins(newsItem)
  let klass = 'pa3 bb b--light-gray tiber'
  if (
    activeEntity &&
    activeEntity.type === 'newsItem' &&
    activeEntity.id === newsItem.get('id')
  ) {
    klass += ' bg-foam'
  }
  return (
    <div className={klass}>
      <div
        className="pointer"
        onClick={() =>
          setActiveEntity({ type: 'newsItem', id: newsItem.get('id') })
        }
      >
        <h4 className="fw6 mv3 f4">{newsItem.get('title')}</h4>
      </div>
      <div className="flex justify-between flex-wrap">
        <div className="f7 silver">
          {timeago().format(newsItem.get('published_date'))}
        </div>
        <div>
          {coins.map((coin, index) => (
            <div
              key={index}
              className="tag pointer"
              onClick={() =>
                setActiveEntity({
                  type: 'coin',
                  id: coin.get('id'),
                  label: coin.get('name')
                })
              }
            >
              {coin && coin.get('symbol')}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
