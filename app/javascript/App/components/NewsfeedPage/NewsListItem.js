import React from 'react'
import timeago from 'timeago.js'
import { stringHostname } from '../../lib/urlHelpers'
import NewsCoinTags from './NewsCoinTags'

const handleClick = (setActiveEntity, entity, toggleUI) => {
  setActiveEntity(entity)
  toggleUI('newsfeedModal', { toggleBodyScroll: window.isMobile })
}

const NewsListItem = (props) => {
  const { activeEntity, newsItem, setActiveEntity, preRender, toggleUI } = props
  let className = 'bb b--light-gray tiber overflow-hidden'
  if (activeEntity) {
    const { type, id } = activeEntity
    if (type === 'newsItem' && id === newsItem.get('id'))
      className += ' bg-foam'
  }
  if (preRender) className += ' o-0 absolute'
  return (
    <div className={className} style={{ height: props.height || 'auto' }}>
      <div className="pa3">
        <div
          className="pointer"
          onClick={handleClick.bind(
            this,
            setActiveEntity,
            { type: 'newsItem', id: newsItem.get('id') },
            toggleUI
          )}
        >
          <h4 className="fw6 mv3 f4">{newsItem.get('title')}</h4>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="f6 silver" title={newsItem.get('published_date')}>
            {timeago().format(newsItem.get('published_date'))}
            <span className="ph2">~</span>
            <a
              href={newsItem.get('url')}
              target="_blank"
              rel="nofollow"
              className="dib silver"
            >
              {stringHostname(newsItem.get('url'))}
            </a>
          </div>
          <NewsCoinTags {...props} />
        </div>
      </div>
    </div>
  )
}

export default NewsListItem
