import React, { Component } from 'react'
import Switch from '../../Switch'
import TwitterLogo from '../../../images/logo-twitter.svg'

class ToggleTwitter extends Component {
  add() {
    const selectedItems = () => this.props.selectedItems || []
    let items = selectedItems()
    if (!items.feedSources) {
      items.feedSources = []
    }
    items.feedSources.push('twitter')
    this.props.onChange(items.feedSources)
  }
  remove() {
    const selectedItems = () => this.props.selectedItems || []
    const items = selectedItems().feedSources
    const filterItems = items.filter((item) => item !== 'twitter')
    this.props.onChange(filterItems)
  }

  render() {
    const filterSelected =
      (this.props.selectedItems &&
        this.props.selectedItems.feedSources &&
        this.props.selectedItems.feedSources.includes('twitter')) ||
      false

    return (
      <div className="pv2">
        <span className="mr2">
          <img src={TwitterLogo} className="mr2 v-top" />
          Twitter
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

export default ToggleTwitter
