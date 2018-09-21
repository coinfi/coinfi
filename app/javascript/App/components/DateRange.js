import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import withDevice from '~/bundles/common/utils/withDevice'

class DateRange extends Component {
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
    const publishedSince = () =>
      this.props &&
      this.props.selectedItems &&
      this.props.selectedItems.publishedSince &&
      moment(this.props.selectedItems.publishedSince)

    const publishedUntil = () =>
      this.props &&
      this.props.selectedItems &&
      this.props.selectedItems.publishedUntil &&
      moment(this.props.selectedItems.publishedUntil)

    return (
      <div className="item-selector-alt nh1 nt1">
        <div className="pv4">
          <div
            className="w-50 dib"
            style={!this.props.isMobile ? { maxWidth: '50%' } : {}}
          >
            <DatePicker
              selected={publishedSince()}
              placeholderText="Start Date"
              selectsStart
              startDate={publishedSince()}
              endDate={publishedUntil()}
              onChange={this.addFrom}
              className="from"
            />
          </div>
          <div
            className="w-50 dib"
            style={!this.props.isMobile ? { maxWidth: '50%' } : {}}
          >
            <DatePicker
              selected={publishedUntil()}
              placeholderText="End Date"
              selectsEnd
              startDate={publishedSince()}
              endDate={publishedUntil()}
              onChange={this.addTo}
              className="to"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withDevice(DateRange)
