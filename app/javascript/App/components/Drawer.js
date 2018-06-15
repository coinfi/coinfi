import React, { Component } from 'react'
import Swipeable from 'react-swipeable'
import Animate from 'react-move/Animate'
import { easeExpOut } from 'd3-ease'

const Drawer = (props) => {
  const { currentUI, uiKey } = props
  const start = { opacity: [0] }
  const enter = { opacity: [1] }
  switch (props.position) {
    case 'left':
      start.translateX = ['-100%']
      enter.translateX = ['0%']
      break
    case 'bottom':
      start.translateY = ['100%']
      enter.translateY = ['0%']
      break
    default:
      break
  }
  return (
    <Animate
      show={!!currentUI(uiKey)}
      start={start}
      enter={{
        ...enter,
        timing: { duration: 700, ease: easeExpOut }
      }}
      leave={{
        ...start,
        timing: { duration: 200 }
      }}
    >
      {(animationProps) => <DrawerContent {...props} {...animationProps} />}
    </Animate>
  )
}

class DrawerContent extends Component {
  handleClose = () => {
    const { toggleUI, uiKey, position } = this.props
    if (position === 'bottom') {
      if (this.drawer.scrollTop === 0) {
        toggleUI(uiKey)
      }
    } else {
      toggleUI(uiKey)
    }
  }
  render() {
    const { className, children, position } = this.props
    const swipeProps = {}
    let style = {}
    switch (position) {
      case 'left':
        swipeProps.onSwipedLeft = this.handleClose
        style = { transform: `translateX(${this.props.translateX})` }
        break
      case 'bottom':
        swipeProps.onSwipedDown = this.handleClose
        style = { transform: `translateY(${this.props.translateY})` }
        break
      default:
        break
    }
    return (
      <Swipeable {...swipeProps}>
        <div className="drawer-bg" style={{ opacity: this.props.opacity }} />
        <div
          className={`drawer${className ? ` ${className}` : ''}`}
          style={style}
          ref={(ref) => (this.drawer = ref)}
        >
          {children}
        </div>
      </Swipeable>
    )
  }
}

export default Drawer
