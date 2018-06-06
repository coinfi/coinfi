/*
 * Renders a layout based on the screen's breakpoint; note that it doesn't
 * change on resize, only on page refresh. 
 */
import React from 'react'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'
import debounce from 'debounce'

class Filters extends React.Component {
  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
  }
  normalizedData = () => {
    const data = {}
    Object.entries(this.props.filterData).forEach(([key, values]) => {
      data[key] = values.map((value) => {
        let id, label
        if (value instanceof Object) {
          if (value.toJS) value = value.toJS()
          id = value.id
          label = value.label || value.title || value.name
        } else {
          id = value
          label = value
        }
        return { id, label }
      })
    })
    return data
  }
  render() {
    const pProps = { ...this.props, filterData: this.normalizedData() }
    if (window.isMobile) {
      return <MobileLayout {...pProps} />
    } else {
      return <DesktopLayout {...pProps} />
    }
  }
}

export default Filters
