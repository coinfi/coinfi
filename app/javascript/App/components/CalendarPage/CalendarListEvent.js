import React from 'react'
import moment from 'moment'
import CoinTags from '../CoinTags'
import BulletSpacer from '../BulletSpacer'

const CalendarListEvent = (props) => {
  const {
    activeEntity,
    calendarEvent,
    setActiveCalendarEvent,
    preRender,
  } = props
  let className = 'b--b tiber overflow-hidden'
  if (activeEntity) {
    const { type, id } = activeEntity
    if (type === 'calendarEvent' && id === calendarEvent.get('id'))
      className += ' bg-foam'
  }
  if (preRender) className += ' o-0 absolute'
  return (
    <div className={className} style={{ height: props.height || 'auto' }}>
      <div className="pa-default">
        <div
          className="pointer"
          onClick={() => {
            setActiveCalendarEvent(calendarEvent)
            if (
              document.querySelector('.selected-calendar-content') &&
              document.querySelector('.selected-calendar-content').parentNode
            )
              document.querySelector(
                '.selected-calendar-content',
              ).parentNode.scrollTop = 0
          }}
        >
          <h2 className="mb2 f4 fw6-m">{calendarEvent.get('name')}</h2>
          <div className="truncate">{calendarEvent.get('description')}</div>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="f6 silver">
            {moment(calendarEvent.get('date_event')).format('MMM DD, YYYY')}
            <BulletSpacer />
            {calendarEvent.get('status')}
          </div>
          <CoinTags {...props} itemWithCoinLinkData={calendarEvent} />
        </div>
      </div>
    </div>
  )
}

export default CalendarListEvent
