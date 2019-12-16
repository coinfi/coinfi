import * as React from 'react'
import Swipeable from 'react-swipeable'
import Animate from 'react-move/Animate'
import { easeExpOut } from 'd3-ease'
import * as _ from 'lodash'
import { createStyles, withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { black70 } from '~/bundles/common/styles/colors'

interface Props {
  onClose: () => void
  position: string
  isShown: boolean
  className: string
  translateX?: string
  translateY?: string
  opacity?: number
  children: React.ReactNode
  controlledRef?: React.RefObject<HTMLElement | null>
  classes: any
}

const styles = (theme) =>
  createStyles({
    drawerBg: {
      background: black70,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 10,
    },
    drawer: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 11,
      maxWidth: '800px',
      margin: '0 auto',
    },
  })

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

  constructor(props) {
    super(props)
    if (!!props.controlledRef) {
      this.drawer = props.controlledRef
    } else {
      this.drawer = React.createRef()
    }
  }

  public handleClose = () => {
    const { onClose, position } = this.props
    if (position === 'bottom') {
      if (_.get(this.drawer, ['current', 'scrollTop']) === 0) {
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
    const { className, children, position, controlledRef, classes } = this.props
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
        <div
          className={classes.drawerBg}
          style={{ opacity: this.props.opacity }}
        />
        <div
          className={classnames(classes.drawer, className)}
          style={style}
          {...!controlledRef && { ref: this.drawer }}
        >
          {children}
        </div>
      </Swipeable>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Drawer)
