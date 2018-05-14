import React, { Component } from 'react'

export default class Tabs extends Component {
  state = { tabKey: 0 }
  componentDidMount() {
    this.showTab(0)
  }
  showTab = tabKey => {
    if (tabKey === this.state.tabKey) return
    const { items, target, onChange } = this.props
    this.setState({ tabKey })
    if (onChange) onChange({ key: tabKey, label: items[tabKey] })
    const container = document.getElementById(target)
    const tabs = container.querySelectorAll(`.tab-content`)
    tabs.forEach((tab, key) => {
      if (tabKey === key) {
        tab.classList.add('active')
      } else {
        tab.classList.remove('active')
      }
    })
  }
  tabClass = tabKey => {
    if (this.state.tabKey === tabKey) return 'tab active'
    return 'tab'
  }
  render() {
    const { items, className } = this.props
    return (
      <div ref={this.handleRef} className={`tabs ${className || ''}`}>
        {items.map((label, key) => (
          <button
            key={key}
            className={this.tabClass(key)}
            onClick={() => this.showTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
    )
  }
}
