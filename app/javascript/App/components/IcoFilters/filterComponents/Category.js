import React, { Component } from 'react'

export default class Category extends Component {
  filterState = () =>
    this.props.activeFilters.find(f => f.get('key') === 'category')
  selectedCategories = () => {
    const state = this.filterState()
    if (!state) return []
    return state.get('value')
  }
  unselectedCategories = () => {
    const { categories } = this.props
    const selected = this.selectedCategories()
    return categories.filter(cat => !selected.includes(cat))
  }
  render() {
    return (
      <div className="oi-pane">
        <div className="oi-pane-content">
          <div>Category</div>
          {this.unselectedCategories().map(cat => <div key={cat}>{cat}</div>)}
        </div>
      </div>
    )
  }
}
