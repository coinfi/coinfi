import React, { Component } from 'react'
import Type from 'prop-types'

export default class ItemSelectorAlt extends Component {
  selectedItems = () => this.props.selectedItems || []
  isSelected = (item) => {
    const selected =
      this.selectedItems().feedSources &&
      this.selectedItems().feedSources.length &&
      this.selectedItems().feedSources.map((item) => JSON.stringify(item))
    if (selected) {
      return selected.includes(JSON.stringify(item))
    }
  }
  add = (item) => {
    let items = this.selectedItems()
    if (!items.feedSources) {
      items.feedSources = []
    }
    items.feedSources.push(item)
    this.props.onChange(items.feedSources)
  }
  remove = (item) => {
    let items = this.selectedItems().feedSources
    items = items.filter((c) => JSON.stringify(c) !== JSON.stringify(item))
    this.props.onChange(items)
  }
  itemLabel = (item) => {
    if (/www/.exec(item) !== null) {
      item = item.replace('www.', '')
    }
    if (item instanceof Object) {
      return item.name || item.title || item.label
    }
    return item
  }

  ItemLink = ({ item }) => {
    if (this.isSelected(item)) {
      return (
        <label
          htmlFor={item}
          className="mid-gray"
          onClick={() => this.remove(item)}
        >
          <input type="checkbox" className="mr2 w-auto" defaultChecked />
          {this.itemLabel(item)}
        </label>
      )
    } else {
      return (
        <label
          htmlFor={item}
          className="mid-gray"
          onClick={() => this.add(item)}
        >
          <input id={item} type="checkbox" className="mr2 w-auto" />
          {this.itemLabel(item)}
        </label>
      )
    }
  }
  render() {
    const { ItemLink } = this
    return (
      <div className="item-selector-alt">
        <ul>
          {this.props.items.map((item, i) => {
            if (/www/.exec(item) !== null) {
              item = item.replace('.www', '').replace(/^/, 'www.')
            }
            return (
              <li className="mv2" key={i}>
                <ItemLink item={item} />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

ItemSelectorAlt.propTypes = {
  items: Type.array.isRequired,
  selectedItems: Type.object,
  onChange: Type.func,
}
