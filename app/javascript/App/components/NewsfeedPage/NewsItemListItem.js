import React from 'react'
import timeago from 'timeago.js'
import { stringHostname } from '../../lib/urlHelpers'

const NewsItemListItem = (props) => {
  const {
    activeEntity,
    newsItem,
    setActiveEntity,
    selectNewsItemCoins,
    preRender
  } = props
  const coins = selectNewsItemCoins(newsItem)
  let className = 'bb b--light-gray tiber overflow-hidden'
  if (activeEntity) {
    const { type, id } = activeEntity
    if (type === 'newsItem' && id === newsItem.get('id'))
      className += ' bg-foam'
  }
  if (preRender) className += ' o-0 absolute'
  return (
    <div className={className} style={{ height: props.height || 'auto' }}>
      <div className="pa3">
        <div
          className="pointer"
          onClick={() =>
            setActiveEntity({ type: 'newsItem', id: newsItem.get('id') })
          }
        >
          <h4 className="fw6 mv3 f4">{newsItem.get('title')}</h4>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="f6 silver" title={newsItem.get('published_date')}>
            {timeago().format(newsItem.get('published_date'))}
            <span className="ph2" />
            {stringHostname(newsItem.get('url'))}
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
    </div>
  )
}

export default NewsItemListItem
