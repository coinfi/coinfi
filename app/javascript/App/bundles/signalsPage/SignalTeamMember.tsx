import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import ButtonBase from '@material-ui/core/ButtonBase'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'

const styles = (theme) =>
  createStyles({
    root: {},
    avatar: {
      width: 88,
      height: 88,
      [theme.breakpoints.down('sm')]: {
        width: 50,
        height: 50,
      },
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
    roleDescription: {
      marginRight: 10,
    },
  })

interface State {
  anchorEl: any
}

interface Props {
  classes: any
  name: string
  avatarUrl: string
  description: string
  roleDescription: string
}

class SignalTeamMember extends React.Component<Props, State> {
  public state = {
    anchorEl: null,
  }

  public handlePopoverOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  public handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
    })
  }

  public render() {
    const {
      classes,
      name,
      avatarUrl,
      description,
      roleDescription,
    } = this.props
    const open = Boolean(this.state.anchorEl)
    const id = `${name}-popover`

    return (
      <div className={classes.root}>
        <ButtonBase
          aria-owns={open ? id : null}
          aria-haspopup="true"
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
          onClick={this.handlePopoverOpen}
        >
          <Avatar className={classes.avatar} src={avatarUrl} />
        </ButtonBase>

        <Popover
          id={id}
          className={classes.popover}
          open={open}
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
            <Typography className={classes.roleDescription}>
              {roleDescription}
            </Typography>
          </div>
        </Popover>
      </div>
    )
  }
}

export default withStyles(styles)(SignalTeamMember)
