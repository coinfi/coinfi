import React, {Component} from 'react'
import Type from 'prop-types'

export default class ItemSelector extends Component {
  selectedItems = () => this.props.selectedItems || []
  unselectedItems = () => {
    const {items} = this.props
    const selected = this.selectedItems().map(item => JSON.stringify(item))
    return items.filter(item => !selected.includes(JSON.stringify(item)))
  }
  add = item => {
    let items = this.selectedItems()
    items.push(item)
    this.props.onChange(items)
  }
  remove = item => {
    let items = this.selectedItems()
    items = items.filter(c => c !== item)
    this.props.onChange(items)
  }
  itemLabel = item => {
    if (item instanceof Object) return item.name || item.title || item.label
    return item
  }
  render() {
    return (
      <div>
        <div className="pb2">
          <ul>
            {this.selectedItems().map((item, i) => (
              <li key={i}>
                <a onClick={() => this.remove(item)}>
                  <span className="aqua">{this.itemLabel(item)}</span>
                  <i className="fal fa-minus ml3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="bt b--geyser pv2 max-h18e-m overflow-y-scroll-m">
          <ul>
            {this.unselectedItems().map((item, i) => (
              <li key={i}>
                <a onClick={() => this.add(item)}>
                  {this.itemLabel(item)}
                  <i className="fal fa-plus ml3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

ItemSelector.propTypes = {
  items: Type.array.isRequired,
  selectedItems: Type.array,
  onChange: Type.func,
}
