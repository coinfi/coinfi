import React from 'react'
import dateFormat from 'dateformat'

export default ({ article, selectArticleTags, setUI }) => {
  const tags = selectArticleTags(article.get('id'))
  return (
    <div className="pa3 bb b--light-gray tiber">
      <div
        className="pointer"
        onClick={() =>
          setUI(['newsfeed', 'body', 'article', article.get('id')])
        }
      >
        <h4 className="fw6 mv3 f4">{article.get('title')}</h4>
        <div className="f7">
          {dateFormat(article.get('published_date'), 'dddd, mmmm dS, yyyy')}
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
