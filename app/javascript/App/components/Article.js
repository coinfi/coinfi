import React from 'react'
import dateFormat from 'dateformat'

export default ({ article, tags }) => {
  return (
    <a
      className="box tiber mb2 mb4-l"
      href={article.get('url')}
      target="_blank"
    >
      <div className="f7">
        {dateFormat(article.get('published_date'), 'dddd, mmmm dS, yyyy')}
      </div>
      <h4 className="fw6 mv3 f3 f2-l">{article.get('title')}</h4>
      <div className="pt1 lh-copy">{article.get('summary')}</div>
      {article.get('tags').length > 0 && (
        <div className="mt3">
          {article.get('tags').map(id => (
            <div key={id} className="tag">
              {tags.getIn([id, 'name'])}
            </div>
          ))}
        </div>
      )}
    </a>
  )
}
