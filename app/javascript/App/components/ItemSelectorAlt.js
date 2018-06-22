import React, { Component } from 'react'
import Type from 'prop-types'
import Icon from './Icon'

const inputStyle = {
  width: 'auto',
  marginRight: '.5rem'
}

export default class ItemSelectorAlt extends Component {
  selectedItems = () => this.props.selectedItems || []
  isSelected = (item) => {
    const selected = this.selectedItems().feedSources && this.selectedItems().feedSources.length && this.selectedItems().feedSources.map((item) => JSON.stringify(item))
    if (selected) return selected.includes(JSON.stringify(item))
  }
  add = (item) => {
    let items = this.selectedItems()
	if (!items.feedSources) items.feedSources = []
    items.feedSources.push(item)
    this.props.onChange(items.feedSources)
  }
  remove = (item) => {
    let items = this.selectedItems().feedSources
    items = items.filter((c) => JSON.stringify(c) !== JSON.stringify(item))
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
			<input type="checkbox" style={inputStyle} defaultChecked />
          {this.itemLabel(item)}
        </button>
      )
    } else {
      return (
        <button onClick={() => this.add(item)}>
			<input type="checkbox" style={inputStyle} />
          {this.itemLabel(item)}
        </button>
      )
    }
  }
  render() {
    const { ItemButton } = this
    return (
      <div className="item-selector-alt nh1 nt1">
        <ul style={{marginLeft:'-1rem'}}>
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
  selectedItems: Type.object,
  onChange: Type.func
}
