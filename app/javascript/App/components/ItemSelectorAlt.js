import React, { Component } from 'react'
import Type from 'prop-types'
import Icon from './Icon'

export default class ItemSelectorAlt extends Component {
  selectedItems = () => this.props.selectedItems || []
  isSelected = (item) => {
    const selected = this.selectedItems().map((item) => JSON.stringify(item))
    return selected.includes(JSON.stringify(item))
  }
  add = (item) => {
    let items = this.selectedItems()
    items.push(item)
    this.props.onChange(items)
  }
  remove = (item) => {
    let items = this.selectedItems()
    items = items.filter((c) => JSON.stringify(c) !== JSON.stringify(item))
    console.log(items)
    console.log(item)
    this.props.onChange(items)
  }
  itemLabel = (item) => {
    if (item instanceof Object) return item.name || item.title || item.label
    return item
  }
  ItemButton = ({ item }) => {
    if (this.isSelected(item)) {
      return (
        <button className="selected" onClick={() => this.remove(item)}>
          <span className="mr2">
            <Icon name="check" regular />
          </span>
          {this.itemLabel(item)}
        </button>
      )
    } else {
      return (
        <button onClick={() => this.add(item)}>
          <Icon name="times" regular className="mr2" />
          {this.itemLabel(item)}
        </button>
      )
    }
  }
  render() {
    const { ItemButton } = this
    return (
      <div className="item-selector-alt nh1 nt1">
        <ul>
          {this.props.items.map((item, i) => (
            <li key={i} className="pa1">
              <ItemButton item={item} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

ItemSelectorAlt.propTypes = {
  items: Type.array.isRequired,
  selectedItems: Type.array,
  onChange: Type.func
}
