import React, { Component } from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'
import CoinTags from '../CoinTags'
import BulletSpacer from '../BulletSpacer'
import Icon from '../Icon'

export default class CalendarBody extends Component {
  render() {
    const {
      selectCalendarEventFromList,
      activeEntity,
      selectNewsCategories,
    } = this.props
    const { id } = activeEntity
    const calendarEvent = selectCalendarEventFromList(id)
    if (!calendarEvent) {
      return null
    }
    const categories = selectNewsCategories(calendarEvent)
    const content = _.trim(calendarEvent.get('description'))
    return (
      <div className="pa3 bg-white min-h-100 selected-calendar-content">
        <CoinTags itemWithCoinLinkData={calendarEvent} />
        <h1 className="break-word f4">{calendarEvent.get('title')}</h1>
        <div className="mb3 f6">
          <a
            href={calendarEvent.get('url')}
            target="_blank"
            rel="nofollow"
            className="break-all"
          >
            <Icon name="link" className="mr1 f7" regular />
            {calendarEvent.get('url')}
          </a>
        </div>
        <div className="mb3 f6">
          <Icon name="clock" className="mr1 f7" regular />
          {timeago().format(calendarEvent.get('date_event'))}
          <BulletSpacer />
          <span>
            {new Date(calendarEvent.get('date_event')).toLocaleString()}
          </span>
        </div>
        {categories.size > 0 && (
          <div className="mv3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.get('name')}
              </div>
            ))}
          </div>
        )}
        <div className="mv3 b--b" />
        <div
          className="lh-copy"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
          }}
        />
      </div>
    )
  }
}
