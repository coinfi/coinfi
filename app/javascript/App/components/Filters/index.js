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
import EventListener from 'react-event-listener'

class Filters extends React.Component {
  handleWindowResize = debounce(() => this.forceUpdate(), 500)

  render() {
    const { filterData, isMobile, ...props } = this.props
    const pProps = { ...props, filterData: normalizeFilterData(filterData) }

    return (
      <EventListener target="window" onResize={this.handleWindowResize}>
        {isMobile ? (
          <MobileLayout {...pProps} />
        ) : (
          <DesktopLayout {...pProps} />
        )}
      </EventListener>
    )
  }
}

export default withDevice(Filters)
