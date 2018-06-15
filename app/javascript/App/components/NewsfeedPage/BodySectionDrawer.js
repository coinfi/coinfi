import React from 'react'
import Drawer from '../Drawer'
import Icon from '../Icon'
import BodySection from './BodySection'

const BodySectionDrawer = (props) => {
  const closeDrawer = () => {
    props.toggleUI('bodySectionDrawer', {
      toggleBodyScroll: window.isMobile
    })
  }
  return (
    <Drawer uiKey="bodySectionDrawer" {...props} position="bottom">
      <div className="absolute top-0 left-0 bottom-0 right-0 bg-white">
        <Icon name="times" className="fr" onClick={closeDrawer} />
        <BodySection {...props} />
      </div>
    </Drawer>
  )
}

export default BodySectionDrawer
