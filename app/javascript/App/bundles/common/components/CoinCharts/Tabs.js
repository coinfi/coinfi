import React, { Component } from 'react'
import classname from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { sansAlt } from '../../styles/typography'
import { tiber, white70 } from '../../styles/colors'
import classnames from 'classnames'

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    tabs: {
      display: 'flex',
      '& .tab': {
        fontSize: '0.9rem',
        color: isDarkMode ? white70 : tiber,
        fontFamily: sansAlt,
        fontWeight: 'bold',
        textAlign: 'center',
        cursor: 'pointer',
        border: 'none',
        borderBottom: '3px solid transparent',
        padding: '0.5rem 0',
        display: 'block',
        background: 'transparent',
        '&:not(:last-child)': {
          marginRight: '2rem',
        },
        '&.active': {
          borderBottomColor: isDarkMode ? white70 : tiber,
          cursor: 'default',
        },
      },
    },
    '& .tab-content:not(.active)': {
      position: 'fixed !important',
      clip: 'rect(1px, 1px, 1px, 1px)',
      opacity: 0,
      overflow: 'hidden',
    },
  })
}

class Tabs extends Component {
  state = { tabKey: 0 }

  componentDidMount() {
    this.showTab(0)
  }

  showTab = (tabKey) => {
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

  render() {
    const { items, classes, className } = this.props
    const { tabKey: activeTabKey } = this.state
    return (
      <div ref={this.handleRef} className={classname(classes.tabs, className)}>
        {items.map((label, key) => (
          <button
            key={key}
            className={classnames('tab', { active: activeTabKey === key })}
            onClick={() => this.showTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
    )
  }
}

export default withStyles(styles)(Tabs)
