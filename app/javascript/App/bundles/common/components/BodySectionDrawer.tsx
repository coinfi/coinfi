import * as React from 'react'
import Drawer from './Drawer'
import Icon from './Icon'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'

interface Props {
  isShown: boolean
  onClose: () => void
  bodySection: any
  skipAnimation?: boolean
  classes: any
}

const styles = (theme) =>
  createStyles({
    iconWrapper: {
      [theme.breakpoints.up('md')]: {
        paddingTop: '1rem',
        paddingBottom: '0.5rem',
        paddingRight: '2px',
        textAlign: 'right',
      },
      [theme.breakpoints.down('sm')]: {
        paddingTop: '2rem',
        paddingBottom: '2rem',
        textAlign: 'center',
      },
    },
    scrollable: {
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    },
  })

class BodySectionDrawer extends React.Component<Props, {}> {
  private scrollableElementRef = React.createRef<HTMLDivElement>()

  public render() {
    const { classes, ...remainingProps } = this.props

    return (
      <Drawer
        {...remainingProps}
        position={this.props.skipAnimation ? 'none' : 'bottom'}
        className="flex flex-column"
        onClose={this.props.onClose}
        isShown={this.props.isShown}
        controlledRef={this.scrollableElementRef}
      >
        <div
          className={classnames('flex-none', classes.iconWrapper)}
          onClick={this.props.onClose}
        >
          <Icon name="times" className="f4 white" noPadding={true} />
        </div>
        <div
          className={classnames(
            'flex-auto overflow-y-auto bg-white relative',
            classes.scrollable,
          )}
          ref={this.scrollableElementRef}
        >
          {this.props.bodySection}
        </div>
      </Drawer>
    )
  }
}

export default withStyles(styles)(BodySectionDrawer)
