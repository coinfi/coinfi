import React from 'react'
import timeago from 'timeago.js'

export default ({
  newsItem,
  selectNewsItemTags,
  setCurrentEntity,
  activeEntity
}) => {
  const tags = selectNewsItemTags(newsItem)
  let klass = 'pa3 bb b--light-gray tiber'
  if (
    activeEntity &&
    activeEntity.type === 'newsItem' &&
    activeEntity.id === newsItem.get('id')
  )
    klass += ' bg-foam'
  return (
    <div className={klass}>
      <div
        className="pointer"
        onClick={() =>
          setCurrentEntity({ type: 'newsItem', id: newsItem.get('id') })
        }
      >
        <h4 className="fw6 mv3 f4">{newsItem.get('title')}</h4>
        <div className="f7">
          {timeago().format(newsItem.get('published_date'))}
        </div>
      </div>
      {tags.size > 0 && (
        <div className="mt3">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              {tag.get('name')}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
