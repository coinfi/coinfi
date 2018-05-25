import React from 'react'
import dayjs from 'dayjs'

export default ({ newsItem, selectNewsItemTags }) => {
  const tags = selectNewsItemTags(newsItem)
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
      {tags.size > 0 && (
        <div className="mt3">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              {tag.get('name')}
            </div>
          ))}
        </div>
      )}
    </a>
  )
}
