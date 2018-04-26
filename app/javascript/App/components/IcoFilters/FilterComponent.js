/*
 * This will attempt to render a filter component based on the provided
 * "filterKey" prop, as well as pass its state (value) to it if present.
 *
 * It also attempts to set its own state based on what's in activeFilters. This
 * local state is used to temporarily hold the value before it's applied to the
 * main app state.
 */
import React from 'react'
import Types from 'prop-types'
import enhanceWithClickOutside from 'react-click-outside'
import components from './filterComponents'
import Icon from '../Icon'

class FilterComponent extends React.Component {
  state = { value: null }
  activeFilter = () =>
    this.props.activeFilters.find(
      o => o.get('key') === this.props.filter.get('key')
    )
  componentWillMount() {
    const active = this.activeFilter()
    const { filter } = this.props
    let value = filter.get('defaultValue')
    if (active) value = active.get('value')
    if (value && value.toJS) value = value.toJS()
    if (value) this.setState({ value })
  }
  handleClickOutside() {
    const { currentUI, uiKey, toggleUI } = this.props
    if (currentUI(uiKey)) toggleUI(uiKey)
  }
  onChange = value => {
    this.setState({ value })
  }
  applyFilter = () => {
    const { setFilter, toggleUI, uiKey, filter } = this.props
    const { value } = this.state
    if (value || value === false) setFilter(filter.get('key'), value)
    toggleUI(uiKey)
  }
  removeFilter = () => {
    const { removeFilter, toggleUI, uiKey, filter } = this.props
    removeFilter(filter.get('key'))
    toggleUI(uiKey)
  }
  render() {
    const { filter, uiKey } = this.props
    const { value } = this.state
    const { onChange } = this
    const Component = components[filter.get('key')]
    if (!Component) return null
    return (
      <div className="oi-pane">
        <div className="oi-pane-content">
          {filter && (
            <header>
              <div>{filter.get('label')}</div>
              <div>
                {uiKey === 'editFilter' && (
                  <Icon
                    name="trash"
                    className="mr2"
                    onClick={this.removeFilter}
                  />
                )}
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

FilterComponent.propTypes = {
  activeFilters: Types.object.isRequired,
  filter: Types.object.isRequired,
  uiKey: Types.string.isRequired,
  toggleUI: Types.func.isRequired,
  setFilter: Types.func.isRequired,
  removeFilter: Types.func.isRequired
}

export default enhanceWithClickOutside(FilterComponent)
