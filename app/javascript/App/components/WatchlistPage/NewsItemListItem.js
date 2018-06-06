import React from 'react'
import dayjs from 'dayjs'

export default ({ newsItem, selectNewsItemCoins }) => {
  const coins = selectNewsItemCoins(newsItem)
  return (
    <a
      className="box tiber mb1 mb4-l"
      href={newsItem.get('url')}
      target="_blank"
    >
      <div className="f7">
        {dayjs(newsItem.get('published_date')).format('dddd, MMM D, YYYY')}
      </div>
      <h4 className="fw6 mv3 f3">{newsItem.get('title')}</h4>
      <div className="pt1 lh-copy">{newsItem.get('summary')}</div>
      {coins.size > 0 && (
        <div className="mt3">
          {coins.map((coin, index) => (
            <div key={index} className="tag">
              {coin.get('symbol')}
            </div>
          ))}
        </div>
      )}
    </a>
  )
}
