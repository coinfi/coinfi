import React, { Component } from 'react'
import Switch from '../../Switch'
import RedditLogo from '../../../images/logo-reddit.svg'

class ToggleReddit extends Component {
  add() {
    const selectedItems = () => this.props.selectedItems || []
    const items = selectedItems()
    if (!items.feedSources) {
      items.feedSources = []
    }
    items.feedSources.push('reddit')
    this.props.onChange(items.feedSources)
  }
  remove() {
    const selectedItems = () => this.props.selectedItems || []
    const items = selectedItems().feedSources
    const filterItems = items.filter((item) => item !== 'reddit')
    this.props.onChange(filterItems)
  }

  render() {
    const filterSelected =
      (this.props.selectedItems &&
        this.props.selectedItems.feedSources &&
        this.props.selectedItems.feedSources.includes('reddit')) ||
      false

    return (
      <div className="pv2">
        <span className="mr2">
          <img src={RedditLogo} className="mr2 v-top" />
          Reddit
        </span>
        {filterSelected && (
          <Switch
            on={true}
            onChange={(event) => (event ? this.add() : this.remove())}
          />
        )}
        {!filterSelected && (
          <Switch
            on={false}
            onChange={(event) => (event ? this.add() : this.remove())}
          />
        )}
      </div>
    )
  }
}

export default ToggleReddit
