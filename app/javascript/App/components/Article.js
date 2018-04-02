import React from 'react'
import dateFormat from 'dateformat'

export default ({ article, tags }) => {
  return (
    <a className="box tiber mb4" href={article.url} target="_blank">
      <div className="f7">
        {dateFormat(article.published_date, 'dddd, mmmm dS')}
      </div>
      <h4 className="fw6 mv3 f3 f2-l">{article.title}</h4>
      <div className="pt1 lh-copy">{article.summary}</div>
      {article.tags.length > 0 && (
        <div className="mt3">
          {article.tags.map(id => (
            <div key={id} className="tag">
              {tags[id].name}
            </div>
          ))}
        </div>
      )}
    </a>
  )
}
