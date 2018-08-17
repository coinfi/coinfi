import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

export default class ItemSelectorDates extends Component {
  selectedItems = () => this.props.selectedItems || []

  addFrom = (item) => {
    let items = this.selectedItems()
    items.publishedSince = item.currentTarget.value
    this.props.onChange(items)
  }
  addTo = (item) => {
    let items = this.selectedItems()
    items.publishedUntil = item.currentTarget.value
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
    const publishedSince =
      (this.props &&
        this.props.selectedItems &&
        this.props.selectedItems.publishedSince) ||
      ''
    const publishedUntil =
      (this.props &&
        this.props.selectedItems &&
        this.props.selectedItems.publishedUntil) ||
      ''

    return (
      <div className="item-selector-alt nh1 nt1">
        <div className="pv4">
          <DatePicker />

          <DatePicker />
          <div
            className="w-50 dib"
            style={!window.isMobile ? { maxWidth: '50%' } : {}}
          >
            <label className="f6">Start Date</label>
            <input
              type="date"
              className="from"
              onChange={this.addFrom.bind(this)}
              value={publishedSince}
            />
          </div>
          <div
            className="w-50 dib"
            style={!window.isMobile ? { maxWidth: '50%' } : {}}
          >
            <label className="f6">End Date</label>
            <input
              type="date"
              className="to"
              onChange={this.addTo.bind(this)}
              value={publishedUntil}
            />
          </div>
        </div>
      </div>
    )
  }
}
