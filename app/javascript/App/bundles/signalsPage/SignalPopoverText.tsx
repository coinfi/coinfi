import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'

const styles = (theme) =>
  createStyles({
    root: {},
    text: {
      color: '#2faeed',
      cursor: 'pointer',
    },
    popover: {
      pointerEvents: 'none',
      marginTop: 20,
    },
    popoverContent: {
      margin: theme.spacing.unit * 2,
    },
    description: {
      maxWidth: 300,
      marginBottom: theme.spacing.unit * 2,
    },
  })

interface State {
  anchorEl: any
  popoverOpen: boolean
}

interface Props {
  classes: any
  text: string
  description: string
}

class SignalTeamMember extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
      popoverOpen: false,
    }
  }

  public handlePopoverOpen = (event) => {
    this.setState({
      popoverOpen: true,
      anchorEl: event.currentTarget,
    })
  }

  public handlePopoverClose = () => {
    this.setState({
      popoverOpen: false,
      anchorEl: null,
    })
  }

  public render() {
    const { classes, text, description } = this.props

    return (
      <span className={classes.root}>
        <span
          className={classes.text}
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
        >
          {text}
        </span>

        <Popover
          className={classes.popover}
          open={this.state.popoverOpen}
          onClose={this.handlePopoverClose}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          disableRestoreFocus={true}
        >
          <div className={classes.popoverContent}>
            <Typography className={classes.description}>
              {description}
            </Typography>
          </div>
        </Popover>
      </span>
    )
  }
}

export default withStyles(styles)(SignalTeamMember)
