import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

export default class ItemSelectorDates extends Component {
  state = {
    startDate: moment(),
  }

  selectedItems = () => this.props.selectedItems || []

  addFrom = (item) => {
    let items = this.selectedItems()
    items.publishedSince = item.format('YYYY-MM-DD')
    this.props.onChange(items)
  }

  addTo = (item) => {
    let items = this.selectedItems()
    items.publishedUntil = item.format('YYYY-MM-DD')
    this.props.onChange(items)
  }

  remove = (item) => {
    let items = this.selectedItems().categories
    items = items.filter((c) => JSON.stringify(c) !== JSON.stringify(item))
    this.props.onChange(items)
  }
  itemLabel = (item) => {
    if (item instanceof Object) {
      return item.name || item.title || item.label
    }
    return item
  }

  render() {
    const publishedSince = () => {
      return (
        this.props &&
        this.props.selectedItems &&
        moment(this.props.selectedItems.publishedSince)
      )
    }
    const publishedUntil =
      (this.props &&
        this.props.selectedItems &&
        moment(this.props.selectedItems.publishedUntil)) ||
      ''

    return (
      <div className="item-selector-alt nh1 nt1">
        <div className="pv4">
          <div
            className="w-50 dib"
            style={!window.isMobile ? { maxWidth: '50%' } : {}}
          >
            <label className="f6">Start Date</label>
            <DatePicker
              className="from"
              onChange={this.addFrom.bind(this)}
              selected={publishedSince()}
            />
          </div>
          <div
            className="w-50 dib"
            style={!window.isMobile ? { maxWidth: '50%' } : {}}
          >
            <label className="f6">End Date</label>
            <DatePicker
              className="to"
              onChange={this.addTo.bind(this)}
              selected={publishedUntil()}
            />
          </div>
        </div>
      </div>
    )
  }
}
