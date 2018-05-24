import React from 'react'
import timeago from 'timeago.js'

export default ({
  article,
  selectArticleTags,
  setCurrentEntity,
  activeEntity
}) => {
  const tags = selectArticleTags(article)
  let klass = 'pa3 bb b--light-gray tiber'
  if (
    activeEntity &&
    activeEntity.type === 'article' &&
    activeEntity.id === article.get('id')
  )
    klass += ' bg-foam'
  return (
    <div className={klass}>
      <div
        className="pointer"
        onClick={() =>
          setCurrentEntity({ type: 'article', id: article.get('id') })
        }
      >
        <h4 className="fw6 mv3 f4">{article.get('title')}</h4>
        <div className="f7">
          {timeago().format(article.get('published_date'))}
        </div>
      </div>
      {article.get('tags').size > 0 && (
        <div className="mt3">
          {tags &&
            tags.map((tag, index) => (
              <div key={index} className="tag">
                {tag.get('name')}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
