import React, { Component } from 'react'
import Type from 'prop-types'

export default class ItemSelector extends Component {
  selectedItems = () => this.props.selectedItems || []
  unselectedItems = () => {
    const { items } = this.props
    let selected = this.selectedItems()
    return items.filter(item => !selected.includes(item))
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
  render() {
    return (
      <div>
        <div className="pb2">
          <ul>
            {this.selectedItems().map((item, i) => (
              <li key={i}>
                <button onClick={() => this.remove(item)}>
                  <span className="aqua">{item}</span>
                  <i className="fal fa-minus ml3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bt b--geyser pv2 max-h18e-m overflow-y-scroll-m">
          <ul>
            {this.unselectedItems().map(item => (
              <li key={item}>
                <button onClick={() => this.add(item)}>
                  {item}
                  <i className="fal fa-plus ml3" />
                </button>
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
  onChange: Type.func
}
