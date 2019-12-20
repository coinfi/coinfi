import React, { Component } from 'react'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { sansAlt } from '../../styles/typography'
import { tiber, white70 } from '../../styles/colors'

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
  })
}

class Tabs extends Component {
  constructor(props) {
    super(props)

    const { defaultToTradingView } = props
    const tabKey = defaultToTradingView ? 1 : 0

    this.state = {
      tabKey,
    }
    this.handleOnChange(tabKey)
  }

  setTab = (tabKey) => {
    if (tabKey === this.state.tabKey) return
    this.setState({ tabKey })
    this.handleOnChange(tabKey)
    this.props.setDefaultToTradingView(tabKey === 1)
  }

  handleOnChange(tabKey) {
    const { items, onChange } = this.props
    if (onChange) onChange({ key: tabKey, label: items[tabKey] })
  }

  render() {
    const { items, classes, className } = this.props
    const { tabKey: activeTabKey } = this.state
    return (
      <div ref={this.handleRef} className={classnames(classes.tabs, className)}>
        {items.map((label, key) => (
          <button
            key={key}
            className={classnames('tab', { active: activeTabKey === key })}
            onClick={() => this.setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
    )
  }
}

export default withStyles(styles)(Tabs)
