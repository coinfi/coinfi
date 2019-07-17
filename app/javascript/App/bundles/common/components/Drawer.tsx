import * as React from 'react'
import Swipeable from 'react-swipeable'
import Animate from 'react-move/Animate'
import { easeExpOut } from 'd3-ease'

interface Props {
  onClose: () => void
  position: string
  isShown: boolean
  className: string
  translateX?: string
  translateY?: string
  opacity?: number
  children: React.ReactNode
}

const Drawer = (props: Props) => {
  const start: any = { opacity: [0] }
  const enter: any = { opacity: [1] }
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
      start.opacity = [1]
      break
  }
  return (
    <Animate
      show={!!props.isShown}
      start={start}
      enter={{
        ...enter,
        timing: { duration: 700, ease: easeExpOut },
      }}
      leave={{
        ...start,
        timing: { duration: 200 },
      }}
    >
      {(animationProps) => <DrawerContent {...props} {...animationProps} />}
    </Animate>
  )
}

class DrawerContent extends React.Component<Props, {}> {
  public state = { swipeAttempts: 0 }
  private drawer: any
  public handleClose = () => {
    const { onClose, position } = this.props
    if (position === 'bottom') {
      if (this.drawer.scrollTop === 0) {
        const { swipeAttempts } = this.state
        this.setState({ swipeAttempts: swipeAttempts + 1 })
        if (swipeAttempts === 2) {
          onClose()
        }
      }
    } else {
      onClose()
    }
  }
  public render() {
    const { className, children, position } = this.props
    const swipeProps: any = {}
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
