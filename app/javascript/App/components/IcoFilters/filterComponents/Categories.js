import React, { Component } from 'react'
import Type from 'prop-types'

export default class Categories extends Component {
  selectedCategories = () => {
    const { value } = this.props
    if (value) return value.toJS()
    return []
  }
  unselectedCategories = () => {
    const { categories } = this.props
    let selected = this.selectedCategories()
    return categories.filter(cat => !selected.includes(cat))
  }
  add = cat => {
    let selected = this.selectedCategories()
    selected.push(cat)
    this.props.setFilter('categories', selected)
  }
  remove = cat => {
    let selected = this.selectedCategories()
    selected = selected.filter(c => c !== cat)
    this.props.setFilter('categories', selected)
  }
  render() {
    return (
      <div className="oi-pane">
        <div className="oi-pane-content">
          <div className="pa2">
            <div>Category</div>
            <ul>
              {this.selectedCategories().map((cat, i) => (
                <li key={`selected-cat-${i}`}>
                  <button onClick={() => this.remove(cat)}>
                    {cat}
                    <i className="fas fa-minus ml3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bt b--geyser pa2 h5 overflow-x-scroll">
            <ul>
              {this.unselectedCategories().map(cat => (
                <li key={cat}>
                  <button onClick={() => this.add(cat)}>
                    {cat}
                    <i className="fas fa-plus ml3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

Categories.propTypes = {
  value: Type.array,
  categories: Type.array,
  setFilter: Type.func
}
