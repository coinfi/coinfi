import React from 'react'
import dayjs from 'dayjs'

export default ({ article, selectArticleTags }) => {
  const tags = selectArticleTags(article.get('id'))
  return (
    <a
      className="box tiber mb1 mb4-l"
      href={article.get('url')}
      target="_blank"
    >
      <div className="f7">
        {dayjs(article.get('published_date')).format('dddd, MMM D, YYYY')}
      </div>
      <h4 className="fw6 mv3 f3">{article.get('title')}</h4>
      <div className="pt1 lh-copy">{article.get('summary')}</div>
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
    </a>
  )
}
