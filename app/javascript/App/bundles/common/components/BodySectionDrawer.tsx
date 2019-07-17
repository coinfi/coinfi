import * as React from 'react'
import Drawer from './Drawer'
import Icon from './Icon'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { white } from '../styles/colors'

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
  })

const BodySectionDrawer = (props: Props) => (
  <Drawer
    {...props}
    position={props.skipAnimation ? 'none' : 'bottom'}
    className="flex flex-column"
    onClose={props.onClose}
    isShown={props.isShown}
  >
    <div
      className={classnames('flex-none', props.classes.iconWrapper)}
      onClick={props.onClose}
    >
      <Icon name="times" className="f4 slate" noPadding={true} />
    </div>
    <div className="flex-auto overflow-y-auto bg-white relative">
      {props.bodySection}
    </div>
  </Drawer>
)

export default withStyles(styles)(BodySectionDrawer)
