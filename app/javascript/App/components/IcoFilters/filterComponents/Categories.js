import React, { Component } from 'react'
import Type from 'prop-types'

export default class Categories extends Component {
  selectedCategories = () => this.props.value || []
  unselectedCategories = () => {
    const { categories } = this.props
    let selected = this.selectedCategories()
    return categories.filter(cat => !selected.includes(cat))
  }
  add = cat => {
    let cats = this.selectedCategories()
    cats.push(cat)
    this.props.onChange(cats)
  }
  remove = cat => {
    let cats = this.selectedCategories()
    cats = cats.filter(c => c !== cat)
    this.props.onChange(cats)
  }
  render() {
    return (
      <div>
        <div className="pa3">
          <ul>
            {this.selectedCategories().map((cat, i) => (
              <li key={`selected-cat-${i}`}>
                <button onClick={() => this.remove(cat)}>
                  {cat}
                  <i className="fal fa-minus ml3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bt b--geyser pa3 h5 overflow-x-scroll">
          <ul>
            {this.unselectedCategories().map(cat => (
              <li key={cat}>
                <button onClick={() => this.add(cat)}>
                  {cat}
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

Categories.propTypes = {
  value: Type.array,
  categories: Type.array,
  setFilter: Type.func
}
