/*
 * This will attempt to render a filter component based on the provided
 * "filterKey" prop, as well as pass its state (value) to it if present.
 *
 * It also attempts to set its own state based on what's in activeFilters. This
 * local state is used to temporarily hold the value before it's applied to the
 * main app state.
 */
import React, { Fragment } from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import components from './filterComponents'
import Icon from '../Icon'

class FilterComponent extends React.Component {
  state = { value: null }
  componentDidMount() {
    const { activeFilters, filterKey } = this.props
    const activeFilter = activeFilters.find(o => o.get('key') === filterKey)
    if (activeFilter) {
      let value = activeFilter.get('value')
      if (value.toJS) value = value.toJS()
      this.setState({ value })
    }
  }
  handleClickOutside() {
    const { currentUI, uiKey, toggleUI } = this.props
    if (currentUI(uiKey)) toggleUI(uiKey)
  }
  onChange = value => {
    this.setState({ value })
  }
  applyFilter = () => {
    const { setFilter, toggleUI, uiKey, filterKey } = this.props
    setFilter(filterKey, this.state.value)
    toggleUI(uiKey)
  }
  render() {
    const { filter, filterKey, uiKey } = this.props
    const { value } = this.state
    const { onChange } = this
    const Component = components[filterKey]
    if (!Component) return null
    return (
      <div className="oi-pane">
        <div className="oi-pane-content">
          {filter && (
            <header>
              <div>{filter.get('label')}</div>
              <div>
                {uiKey === 'editFilter' && <Icon name="trash" />}
                <Icon name="check" onClick={this.applyFilter} />
              </div>
            </header>
          )}
          <Component {...{ ...this.props, value, onChange }} />
        </div>
      </div>
    )
  }
}

export default enhanceWithClickOutside(FilterComponent)
