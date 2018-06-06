import React from 'react'

const NewsItemCoinTags = ({ newsItem }) => {
  return (
    <div>
      {newsItem.get('coin_link_data').map((data, index) => (
        <a
          key={index}
          className="tag pointer"
          href={`/coins/${data.get('slug')}`}
        >
          {data.get('symbol')}
        </a>
      ))}
    </div>
  )
}

export default NewsItemCoinTags
