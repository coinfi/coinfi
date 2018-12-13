import React, { Component, Fragment } from 'react'
import moment from 'moment'

export default class Countdown extends Component {
  timer

  constructor(props) {
    super(props)

    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
    }
  }

  componentWillMount() {
    this.tick()
  }

  componentDidUpdate(prevProps) {
    if (this.props.time !== prevProps.time) {
      this.tock()
    }
  }

  tock() {
    if (typeof this.timer !== 'undefined') clearTimeout(this.timer)
    this.tick()
  }

  tick() {
    const shouldContinue = this.calculateRemainingTime()
    if (shouldContinue) {
      const now = new Date()
      const timeToNextTick =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
      this.timer = setTimeout(this.tick.bind(this), timeToNextTick)
    }
  }

  calculateRemainingTime() {
    const duration = moment.duration(moment(this.props.time).diff(moment()))
    const days = duration.days()
    const hours = duration.hours()
    const minutes = duration.minutes()

    this.setState({
      days,
      hours,
      minutes,
    })

    return days > 0 || hours > 0 || minutes > 0
  }

  render() {
    const { days, hours, minutes } = this.state
    return (
      <Fragment>
        <div className="flex flex-nowrap">
          <div className="tc col-xs-4">
            <div className="bg-pearl-gray pv2">{days}</div>
          </div>
          <div className="tc col-xs-4">
            <div className="bg-pearl-gray pv2">{hours}</div>
          </div>
          <div className="tc col-xs-4">
            <div className="bg-pearl-gray pv2">{minutes}</div>
          </div>
        </div>
        <div className="flex flex-nowrap">
          <div className="tc col-xs-4 pv2">days</div>
          <div className="tc col-xs-4 pv2">hours</div>
          <div className="tc col-xs-4 pv2">minutes</div>
        </div>
      </Fragment>
    )
  }
}
