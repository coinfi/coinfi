import React, { Component, Fragment } from 'react'
import moment from 'moment'
import * as _ from 'lodash'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import Countdown from '../../bundles/common/components/Countdown'

const cornerArrowIcon = require('~/images/cornerArrowIcon.svg')

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
    const source_url = calendarEvent.get('source_url')
    return (
      <Fragment>
        <div className="pa3 b--b bg-white selected-calendar-content">
          {/* <CoinTags itemWithCoinLinkData={calendarEvent} /> */}
          <h1 className="break-word f4">{calendarEvent.get('name')}</h1>
          <div className="mb3 f6">
            <div className="f7">
              {moment(calendarEvent.get('date_event')).format('MMM DD, YYYY')}
              {calendarEvent.get('status') && (
                <Fragment>
                  <BulletSpacer />
                  {calendarEvent.get('status')}
                </Fragment>
              )}
            </div>
          </div>
          <div className="mv3 b--b" />
          <div className="mb3 black">{content}</div>
          {source_url && (
            <div className="mb3 f6">
              <a
                href={calendarEvent.get('source_url')}
                target="_blank"
                rel="nofollow"
                className="break-all"
              >
                See source{' '}
                <img
                  src={cornerArrowIcon}
                  style={{ width: '12px', height: '12px' }}
                />
              </a>
            </div>
          )}
          {categories.size > 0 && (
            <div className="mv3">
              {categories.map((category, index) => (
                <div key={index} className="tag-alt">
                  {category.get('name')}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pa3 b--b bg-white">
          <h3 className="break-word f5">Time to event</h3>
          <Countdown time={calendarEvent.get('date_event')} />
        </div>
      </Fragment>
    )
  }
}
