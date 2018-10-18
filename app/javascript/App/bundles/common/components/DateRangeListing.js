import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import withDevice from '~/bundles/common/utils/withDevice'

class DateRangeListing extends Component {
  selectedItems = () => this.props.selectedItems || []

  addFrom = (item) => {
    let items = this.selectedItems()
    if (item !== null) items.detectedSince = item.format('YYYY-MM-DD')
    this.props && this.props.onChange(items)
  }

  addTo = (item) => {
    let items = this.selectedItems()
    if (item !== null) items.detectedUntil = item.format('YYYY-MM-DD')
    this.props && this.props.onChange(items)
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
    const detectedSince = () =>
      this.props &&
      this.props.selectedItems &&
      this.props.selectedItems.detectedSince &&
      moment(this.props.selectedItems.detectedSince)

    const detectedUntil = () =>
      this.props &&
      this.props.selectedItems &&
      this.props.selectedItems.detectedUntil &&
      moment(this.props.selectedItems.detectedUntil)

    return (
      <div className="item-selector-alt nh1 nt1">
        <div className="pv4">
          <div
            className="w-50 dib"
            style={!this.props.isMobile ? { maxWidth: '50%' } : {}}
          >
            <DatePicker
              selected={detectedSince()}
              placeholderText="Start Date"
              selectsStart
              startDate={detectedSince()}
              endDate={detectedUntil()}
              onChange={this.addFrom}
              className="from"
            />
          </div>
          <div
            className="w-50 dib"
            style={!this.props.isMobile ? { maxWidth: '50%' } : {}}
          >
            <DatePicker
              selected={detectedUntil()}
              placeholderText="End Date"
              selectsEnd
              startDate={detectedSince()}
              endDate={detectedUntil()}
              onChange={this.addTo}
              className="to"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withDevice(DateRangeListing)
