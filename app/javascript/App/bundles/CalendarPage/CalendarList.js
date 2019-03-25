import React, { Component, Fragment } from 'react'
import * as _ from 'lodash'
import moment from 'moment'
import CalendarListEvent from './CalendarListEvent'
import CalendarListEventHeader from './CalendarListEventHeader'
import LoadingIndicator from '../../bundles/common/components/LoadingIndicator'
import Tips from './Tips'
import withDevice from '~/bundles/common/utils/withDevice'

class CalendarList extends Component {
  state = { initialRender: true, initialRenderTips: false }

  constructor(props) {
    super(props)
    this.mountOnScrollHandler = this.mountOnScrollHandler.bind(this)
    this.unmountOnScrollHandler = this.unmountOnScrollHandler.bind(this)
    this.onScrollCalendarMobile = this.onScrollCalendarMobile.bind(this)
    this.onScrollCalendarDesktop = this.onScrollCalendarDesktop.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ initialRender: false })
    }, 60000)
    this.mountOnScrollHandler()
  }

  componentDidUpdate() {
    const timer = setInterval(() => {
      if (!this.props.isMobile) {
        this.props.fetchMoreCalendarEvents()
      }
    }, 60000)
    clearInterval(timer)
  }

  componentWillUnmount() {
    this.unmountOnScrollHandler()
  }

  mountOnScrollHandler() {
    if (this.props.isMobile) {
      const throttled = _.throttle(this.onScrollCalendarMobile, 500)
      $(window).scroll(throttled)
    } else {
      const throttled = _.throttle(this.onScrollCalendarDesktop, 500)
      $('#calendar').scroll(throttled)
    }
  }

  unmountOnScrollHandler() {
    $(window).off('scroll', this.onScrollCalendarMobile)
    $('#calendar').off('scroll', this.onScrollCalendarDesktop)
  }

  onScrollCalendarMobile(e) {
    const $this = $(e.currentTarget)
    const bufferSpace = $this.height() / 3 + 300

    if (
      $this.scrollTop() + $this.height() + bufferSpace >=
      $(document).height()
    ) {
      this.props.fetchMoreCalendarEvents()
    }
  }

  onScrollCalendarDesktop(e) {
    const $this = $(e.currentTarget)
    const bufferSpace = $this.height() / 3 + 400
    if (
      $this.scrollTop() + $this.innerHeight() + bufferSpace >=
      $this[0].scrollHeight
    ) {
      this.props.fetchMoreCalendarEvents()
    }
  }

  setActiveCalendarEvent = (calendarEvent) => {
    const { setActiveEntity, enableUI } = this.props
    setActiveEntity({ type: 'calendarEvent', id: calendarEvent.get('id') })
    if (this.props.isMobile) {
      enableUI('bodySectionDrawer', { fullScreen: true })
    }
  }

  closeTips() {
    this.props.calendarTips()
  }

  renderView(
    viewState,
    itemHeight,
    activeFilters,
    sortedCalendarEvents,
    initialRenderTips,
    isLoading,
  ) {
    if (initialRenderTips && this.props.isMobile) {
      return <Tips closeTips={this.closeTips.bind(this)} />
    } else if (isLoading('calendarEvents')) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    } else if (!viewState.sortedCalendarEvents.length) {
      return (
        <div className="pa3 tc mt4">
          <div className="pointer">
            <h4 className="fw6 mv3 f4">No results found.</h4>
          </div>
          <div className="flex justify-between flex-wrap">
            <div className="f6 silver center">
              <span className="ph2">
                Try changing your search query or removing some filters.
              </span>
            </div>
          </div>
        </div>
      )
    }

    const reducedItems = viewState.sortedCalendarEvents.reduce(
      (data, calendarEvent) => {
        let date = moment(calendarEvent.get('date_event')).format(
          'MMMM DD, YYYY',
        )
        let newDate = date !== data.date

        let events = [...data.events, ...(newDate ? [date] : []), calendarEvent]

        return {
          events,
          date,
        }
      },
      { events: [], date: null },
    )

    const mappedItems = reducedItems.events.map(
      (eventOrDate) =>
        _.isString(eventOrDate) ? (
          <CalendarListEventHeader key={eventOrDate}>
            {eventOrDate}
          </CalendarListEventHeader>
        ) : (
          <CalendarListEvent
            key={eventOrDate.get('id')}
            calendarEvent={eventOrDate}
            {...this.props}
            setActiveCalendarEvent={this.setActiveCalendarEvent}
            selectCoin={(symbol) => this.selectCoin(symbol)}
          />
        ),
    )
    return mappedItems
  }

  selectCoin(coinData) {
    const { setFilter, clearSearch, setActiveEntity } = this.props
    setActiveEntity({ type: 'coin', id: coinData.get('id') })
    let value = this.selectedCoins()
    value = _.union(value, [coinData.get('name')])
    setFilter({ key: 'coins', value })
    clearSearch()
  }

  render() {
    const itemHeight = this.state.initialRender ? 'auto' : 0
    const {
      calendarEvents,
      isLoading,
      activeEntity,
      activeFilters,
      sortedCalendarEvents,
      initialRenderTips,
      isMobile,
    } = this.props
    const viewState = {
      activeEntity: activeEntity,
      calendarEvents: calendarEvents,
      sortedCalendarEvents: sortedCalendarEvents,
    }
    return (
      <Fragment>
        <div
          id="calendar"
          ref={(node) => (this.calendar = node)}
          className="flex-auto relative overflow-y-auto-m"
          style={
            !activeEntity &&
            isMobile &&
            !activeFilters.size &&
            initialRenderTips
              ? { marginTop: '-65px', background: '#fff', position: 'absolute' }
              : {}
          }
        >
          {this.renderView(
            viewState,
            itemHeight,
            activeFilters,
            sortedCalendarEvents,
            initialRenderTips,
            isLoading,
          )}
          <div>
            {!isLoading('calendarEvents') &&
              isLoading('calendar') && <LoadingIndicator />}
          </div>
        </div>
      </Fragment>
    )
  }
}

export default withDevice(CalendarList)
