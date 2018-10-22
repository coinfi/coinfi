import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import Slide from '@material-ui/core/Slide'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Snackbar, {
  SnackbarProps,
  SnackbarOrigin,
} from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CloseIcon from '@material-ui/icons/Close'
import classnames from 'classnames'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import { FlashMessage } from '~/bundles/common/types'

const TRANSITION_DELAY = 150
const TRANSITION_DOWN_DURATION = 200

/**
 * @param {object} anchorOrigin - how snack is postioned. e.g.
 * { vertical: 'bottom', horizontal: 'left' }
 * @param {number} level - Level on which snakcbar should be displayed
 * (when snackbars are stacked on top of eachother)
 */
const getTransitionStyles = (level: number, anchorOrigin: SnackbarOrigin) =>
  Object.assign(
    {
      [anchorOrigin.vertical]: level * 48 + level * 16 + 20,
    },
    {
      WebKitTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
      MozTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
      msTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
      OTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
      transition: `all ${TRANSITION_DOWN_DURATION}ms`,
      transitionDelay: `${TRANSITION_DELAY}ms`,
    },
  )

const TRANSITION_DIRECTION = {
  right: 'left',
  left: 'right',
  bottom: 'up',
  top: 'down',
}

/**
 * Returns the direction when the snackbar transitions away
 */
const getTransitionDirection = (anchorOrigin: SnackbarOrigin) => {
  if (anchorOrigin.horizontal !== 'center') {
    return TRANSITION_DIRECTION[anchorOrigin.horizontal]
  }
  return TRANSITION_DIRECTION[anchorOrigin.vertical]
}

/**
 * Returns the
 * @param flashType - flash message types defined in rails
 */
const getSnackbarVariant = (flashType: string) => {
  switch (flashType) {
    case 'alert':
    case 'danger':
    case 'error':
    case 'validation_errors':
      return 'error'
    case 'warning':
      return 'warning'
    case 'notice':
      return 'info'
    case 'success':
      return 'success'
  }

  throw new Error(`Unrecognized flash type: ${flashType}`)
}

const TransitionComponent = (props) => <Slide {...props} />

interface Props
  extends Pick<SnackbarProps, Exclude<keyof SnackbarProps, 'classes'>> {
  classes: any
  level: number
  message: FlashMessage
}

const styles = (theme) =>
  createStyles({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  })

const FlashMessageListItem: React.StatelessComponent<Props> = (props) => {
  const {
    classes,
    message,
    onClose,
    level,
    open,
    anchorOrigin,
    ...otherProps
  } = props
  const transitionProps: TransitionProps = {
    direction: getTransitionDirection(anchorOrigin),
  } as TransitionProps

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      TransitionComponent={TransitionComponent}
      TransitionProps={transitionProps}
      style={getTransitionStyles(level, anchorOrigin)}
      open={open}
      onClose={onClose}
      {...otherProps}
    >
      <SnackbarContent
        className={classes[getSnackbarVariant(message.type)]}
        message={
          <span className={classes.message}>
            <Icon className={classnames(classes.icon, classes.iconVariant)} />
            {message.text}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={(event) => onClose(event, undefined)}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  )
}

export default withStyles(styles)(FlashMessageListItem)
