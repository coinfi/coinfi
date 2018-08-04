import React, { Component } from 'react'
import Type from 'prop-types'

export default class Events extends Component {
  constructor(props) {
    super(props)
    this.events = props.events || []
  }

  onChange = (item) => this.props.onChange('events')(item)
  selectedItems = () => this.props.value || []

  isSelected = (item) => this.selectedItems().events === item
  select = (item) => {
    this.onChange(item)
  }
  itemLabel = (item) => {
    if (item instanceof Object) {
      return item.name || item.title || item.label
    }
    return item
  }
  ItemButton = ({ item }) => {
    if (this.isSelected(item)) {
      return <button className="selected">{this.itemLabel(item)}</button>
    } else {
      return (
        <button onClick={() => this.select(item)}>
          {this.itemLabel(item)}
        </button>
      )
    }
  }

  render() {
    const { ItemButton } = this

    return (
      <div className="item-segment-alt">
        <div className="pv4">
          {this.events.map((event, i) => <ItemButton key={i} item={event} />)}
        </div>
      </div>
    )
  }
}

Events.propTypes = {
  value: Type.object,
  // events: Type.array.isRequired,
  onChange: Type.func,
}
