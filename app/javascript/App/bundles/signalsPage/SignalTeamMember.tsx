import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'

const styles = (theme) =>
  createStyles({
    root: {},
    popover: {
      pointerEvents: 'none',
    },
    description: {
      margin: theme.spacing.unit * 2,
    },
  })

interface State {
  anchorEl: any
  popoverOpen: boolean
}

interface Props {
  classes: any
  avatarUrl: string
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
    const { classes, avatarUrl, description } = this.props

    return (
      <div className={classes.root}>
        <Avatar
          className={classes.avatar}
          src={avatarUrl}
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
        />

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
          <Typography className={classes.description}>{description}</Typography>
        </Popover>
      </div>
    )
  }
}

export default withStyles(styles)(SignalTeamMember)
