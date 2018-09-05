import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = {
  snackbar: {
    backgroundColor: green[500],
  },
}

const Notification = (props) => {
  const { classes } = props

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000}
      open={props.opened}
      onClose={props.closeNotification}
      ContentProps={{ 'aria-describedby': 'message-id' }}
    >
      <SnackbarContent
        className={classes.snackbar}
        message={<span id="message-id">Signed in successfully.</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={props.closeNotification}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  )
}

export default withStyles(styles)(Notification)

Notification.propTypes = {
  classes: PropTypes.shape({}),
  closeNotification: PropTypes.func,
  opened: PropTypes.bool,
}
