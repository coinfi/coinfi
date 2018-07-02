import React, { Component } from 'react'
import Type from 'prop-types'
import Icon from './Icon'

export default class ItemSelectorDates extends Component {
  selectedItems = () => this.props.selectedItems || []
  isSelected = (item) => {
    const selected = this.selectedItems().categories && this.selectedItems().categories.length && this.selectedItems().categories.map((item) => JSON.stringify(item))
    if (selected) return selected.includes(JSON.stringify(item))
  }
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
  add = (item) => {

    let items = this.selectedItems()
	if (!items.dates) items.dates = []
    items.dates.push(item.currentTarget.value)
    this.props.onChange(items)
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

    // const itemGroups = this.props.items.map((x, i) => {
    //   return i % colSize === 0 ? this.props.items.slice(i, i + colSize) : null;
    // }).filter(x => x != null);


    return (
	  <div className="item-selector-alt nh1 nt1">
		<div className="pv4 bb b--geyser" >
		  <div className='w-50 dib pa2'>
			<label>From</label>
			<input type="date" className="from" onChange={this.addFrom.bind(this)} />
		  </div>
		  <div className='w-50 dib pa2'>
			<label>To</label>
			<input type="date" className="to" onChange={this.addTo.bind(this)} />
		  </div>
		</div>
	  </div>
    )
  }
}

// ItemSelectorCategory.propTypes = {
//   items: Type.array.isRequired,
//   selectedItems: Type.object,
//   onChange: Type.func
// }
