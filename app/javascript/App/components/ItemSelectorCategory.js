import React, { Component } from 'react'
import Type from 'prop-types'
import Icon from './Icon'

export default class ItemSelectorCategory extends Component {
  selectedItems = () => this.props.selectedItems || []
  isSelected = (item) => {
    const selected = this.selectedItems().categories && this.selectedItems().categories.length && this.selectedItems().categories.map((item) => JSON.stringify(item))
    if (selected) return selected.includes(JSON.stringify(item))
  }
  add = (item) => {
    let items = this.selectedItems()
	if (!items.categories) items.categories = []
    items.categories.push(item)
    this.props.onChange(items.categories)
  }
  remove = (item) => {
    let items = this.selectedItems().categories
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
          {this.itemLabel(item)}
        </button>
      )
    } else {
      return (
        <button onClick={() => this.add(item)}>
          {this.itemLabel(item)}
        </button>
      )
    }
  }
  render() {
    const { ItemButton } = this

    let colSize = 0
    if (window.isMobile) {
      colSize = 2
    }
    else {
      colSize = 3
    }

    const itemGroups = this.props.items.map((x, i) => {
      return i % colSize === 0 ? this.props.items.slice(i, i + colSize) : null;
    }).filter(x => x != null);


    return (
      <div className="item-selector-alt nh1 nt1">
        {itemGroups.map((itemGroups, index) => {
          return (<div className="row" key={index}>
            {itemGroups.map((item, innerIndex) => {
              let itemLabel
              if (item === 'Events - Conferences, Meetups, Launches, etc.') {
                itemLabel = 'Events'
              }
              else if (item === 'Security (Vulnerabilities)') {
                itemLabel = 'Security'
              }
              else {
                itemLabel = item
              }
              return (
                <div className="col" span={8} key={innerIndex}>
                  <ItemButton item={itemLabel} style={{cursor:'pointer'}} />
                </div>
              )
            })}
          </div>);
        })}
      </div>
    )
  }
}

ItemSelectorCategory.propTypes = {
  items: Type.array.isRequired,
  selectedItems: Type.object,
  onChange: Type.func
}
