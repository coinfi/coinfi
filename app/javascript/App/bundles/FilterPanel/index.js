import React, { Component } from 'react'
import Types from 'prop-types'
// import Layout from './Layout'
// import FilterComponent from './FilterComponent'
// import { normalizeFilterData } from '../../lib/stateHelpers'

class FilterPanel extends Component {
  state = { filters: this.props.defaultFilters || {} }
  componentDidMount() {
    const filters = { ...this.state.filters }
    // this.props.activeFilters.forEach((value) => {
    //   if (value.toJS) value = value.toJS()
    //   filters[value.key] = value.value
    //   this.setState({ filters })
    // })
  }
  onChange = (key, event) => (value) => {
    const filters = { ...this.state.filters }
    if (value.toJS) value = value.toJS()
    filters[key] = value
    if (value && value.publishedSince) {
      filters[key] = value.publishedSince
    }
    if (value && value.publishedUntil) {
      filters[key] = value.publishedUntil
    }

    if (!value.length) delete filters[key]
    this.setState({ filters })
  }
  applyFilters = () => {
    const { setFilters, disableUI } = this.props
    setFilters(this.state.filters)
    disableUI('filterPanel')
  }
  resetFilters = () => {
    this.setState({ filters: this.props.defaultFilters || {} })
  }
  render() {
    const { filterList, filterData, ...props } = this.props
    const pProps = { ...props }
    const { applyFilters, resetFilters } = this

    let containerClass = 'modal bg-athens'
    if (!window.isMobile)
      containerClass = 'overlay z-999 bg-athens overflow-y-auto'

    return (
      <div className="ph3 ph4-l" style={{ padding: '1rem' }}>
        <div className={containerClass}>
          <div className="pa3 bb b--geyser flex justify-between items-center filter-panel-header">
            <div className="flex items-center">
              <h3 className="mb0 mr1 b">Filters</h3>
              <button
                className="btn btn-white btn-xs"
                onClick={resetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontSize: '12px',
                  color: '#2faeed',
                }}
              >
                Reset
              </button>
            </div>
            <div>
              <button
                className="btn btn-white btn-xs"
                onClick={() => disableUI('filterPanel')}
                style={{
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.54)',
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-blue btn-xs ml3"
                onClick={applyFilters}
                style={{
                  textTransform: 'none',
                  padding: '8px 20px',
                  fontSize: '.88rem',
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        {/* <Layout {...{ ...props, applyFilters, resetFilters }} newsFeedStyle> */}
        {/*   {filterList.map((filter, index) => { */}
        {/*     if (filter.get('key') === 'coins') return null // Temp fix for hiding coins */}
        {/*     if (filter.get('key') === 'keywords') return null */}
        {/*     return ( */}
        {/*       <div> */}
        {/* <FilterComponent */}
        {/*   key={index} */}
        {/*   {...pProps} */}
        {/*   filter={filter} */}
        {/*   onChange={this.onChange} */}
        {/*   value={this.state.filters} */}
        {/*   newsFeedStyle */}
        {/* /> */}
        {/*       </div> */}
        {/*     ) */}
        {/*   })} */}
        {/* </Layout> */}
      </div>
    )
  }
}

export default FilterPanel

FilterPanel.propTypes = {
  activeFilters: Types.object.isRequired,
  setFilters: Types.func.isRequired,
}
