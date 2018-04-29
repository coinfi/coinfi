/*
 * Renders a layout based on the screen's breakpoint; note that it doesn't
 * change on resize, only on page refresh. 
 */
import React from 'react'
import container from '../../containers/icoFilters'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'

const IcoFilters = props => {
  if (['m', 'l'].includes(window.screenSize)) {
    return <DesktopLayout {...props} />
  } else {
    return <MobileLayout {...props} />
  }
}

export default container(IcoFilters)
