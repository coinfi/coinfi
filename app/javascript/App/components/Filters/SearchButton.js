import React, { Component } from 'react'
import Icon from '../../bundles/common/components/Icon'
import FilterComponent from './FilterComponent'

export default class Search extends Component {
  render() {
    const { filterList, toggleUI, currentUI } = this.props
    const uiKey = 'editFilter'
    return (
      <div className="oi">
        {currentUI(uiKey) === 'search' && (
          <FilterComponent
            filter={filterList.get(0)}
            {...this.props}
            uiKey={uiKey}
          />
        )}
        <button className="oi-icon" onClick={() => toggleUI([uiKey, 'search'])}>
          <Icon name="search" />
        </button>
      </div>
    )
  }
}
