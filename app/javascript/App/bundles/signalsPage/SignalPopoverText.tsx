import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
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
}

interface Props {
  classes: any
  text: string
  description: string
}

class SignalPopoverText extends React.Component<Props, State> {
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
    const { classes, text, description } = this.props
    const { anchorEl } = this.state
    const isOpen = Boolean(anchorEl)

    return (
      <span className={classes.root}>
        <ClickAwayListener onClickAway={this.handlePopoverClose}>
          <>
            <span
              aria-owns={isOpen ? 'signal-popover' : null}
              aria-haspopup="true"
              className={classes.text}
              onClick={this.handlePopoverOpen}
            >
              {text}
            </span>

            <Popover
              id="signal-popover"
              className={classes.popover}
              open={isOpen}
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
            >
              <div className={classes.popoverContent}>
                <Typography className={classes.description}>
                  <span dangerouslySetInnerHTML={{ __html: description }} />
                </Typography>
              </div>
            </Popover>
          </>
        </ClickAwayListener>
      </span>
    )
  }
}

export default withStyles(styles)(SignalPopoverText)
