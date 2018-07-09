import React from 'react'
import timeago from 'timeago.js'
import NewsCoinTags from './NewsCoinTags'

const NewsListItem = (props) => {
  const { activeEntity, newsItem, setActiveNewsItem, preRender, selectCoin } = props
  let className = 'b--b tiber overflow-hidden'
  if (activeEntity) {
    const { type, id } = activeEntity
    if (type === 'newsItem' && id === newsItem.get('id'))
      className += ' bg-foam'
  }
  const url = new URL(newsItem.get('url'))
  if (preRender) className += ' o-0 absolute'
  return (
    <div className={className} style={{ height: props.height || 'auto' }}>
      <div className="pa3">
        <div className="pointer" onClick={() => setActiveNewsItem(newsItem)}>
          <h4 className="fw6 mv3 f4">{newsItem.get('title')}</h4>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="f6 silver">
            {timeago().format(newsItem.get('feed_item_published_at'))}
            <span className="ph2">~</span>
            <a
              href={newsItem.get('url')}
              target="_blank"
              rel="nofollow"
              className="dib silver"
            >
              {url.hostname}
            </a>
          </div>
          <NewsCoinTags {...props} />
        </div>
      </div>
    </div>
  )
}

export default NewsListItem
