/*
 * Renders a layout based on the screen's breakpoint; note that it doesn't
 * change on resize, only on page refresh.
 */
import React from 'react'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'
import debounce from 'debounce'
import { normalizeFilterData } from '../../lib/stateHelpers'
import withDevice from '~/bundles/common/utils/withDevice'

class Filters extends React.Component {
  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
  }
  render() {
    const { filterData, isMobile, ...props } = this.props
    const pProps = { ...props, filterData: normalizeFilterData(filterData) }
    if (isMobile) {
      return <MobileLayout {...pProps} />
    } else {
      return <DesktopLayout {...pProps} />
    }
  }
}

export default withDevice(Filters)
