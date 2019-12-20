import * as React from 'react'
import Fab from '@material-ui/core/Fab'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Zoom from '@material-ui/core/Zoom'
import withScrollTrigger from './withScrollTrigger'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { white } from '~/bundles/common/styles/colors'

interface Props {
  classes: any
  trigger: boolean
  onClick: () => void
}

const styles = (theme) =>
  createStyles({
    wrapperDiv: {
      position: 'fixed',
      bottom: `${theme.spacing.unit * 2}px`,
      right: `${theme.spacing.unit * 4}px`,
      [theme.breakpoints.down('sm')]: {
        bottom: `${theme.spacing.unit * 4}px`,
      },
    },
    fabRoot: {
      color: white,
      paddingRight: `${theme.spacing.unit * 3}px !important`, // one more unit than size=medium padding
    },
  })

class BackToTop extends React.Component<Props> {
  public render() {
    const { trigger, classes, onClick } = this.props
    return (
      <Zoom in={trigger}>
        <div
          onClick={onClick}
          role="presentation"
          className={classes.wrapperDiv}
        >
          <Fab
            color="primary"
            size="medium"
            variant="extended"
            disableRipple={true}
            aria-label="back to top"
            className={classes.fabRoot}
          >
            <KeyboardArrowUpIcon />
            Back To Top
          </Fab>
        </div>
      </Zoom>
    )
  }
}

export default withStyles(styles)(
  withScrollTrigger({
    disableHysteresis: true,
    threshold: 500,
  })(BackToTop),
)
