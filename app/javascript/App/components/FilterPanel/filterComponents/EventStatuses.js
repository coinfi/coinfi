import React, { Component, Fragment } from 'react'
import Type from 'prop-types'

const key = 'eventStatuses'

export default class EventStatuses extends Component {
  constructor(props) {
    super(props)
    this.eventStatuses = this.props.eventStatuses || []
  }

  onChange = (item) => this.props.onChange(key)(item)
  selectedItems = () => this.props.value || []

  isSelected = (item) => this.selectedItems()[key] === item
  select = (item) => {
    this.onChange(item)
  }
  itemLabel = (item) => {
    if (item instanceof Object) {
      return item.name || item.title || item.label
    }
    return item
  }
  ItemRadioButton = ({ item }) => {
    const linkClass = `${this.isSelected(item) ? 'selected ' : ''}mid-gray`
    return (
      <li className="mv2">
        <a onClick={() => this.select(item)} className={linkClass}>
          <input
            type="radio"
            className="mr2 w-auto"
            value={this.itemLabel(item)}
            checked={this.isSelected(item)}
          />
          {this.itemLabel(item)}
        </a>
      </li>
    )
  }

  render() {
    const { ItemRadioButton } = this

    return (
      <div className="item-selector-alt">
        <ul>
          {this.eventStatuses.map((status, i) => (
            <ItemRadioButton key={i} item={status} />
          ))}
        </ul>
      </div>
    )
  }
}

EventStatuses.propTypes = {
  value: Type.object,
  onChange: Type.func,
}
