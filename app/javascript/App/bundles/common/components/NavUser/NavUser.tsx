import * as React from 'react'
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core'
import {
  AccountCircle,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@material-ui/icons'
import { MenuProps } from '@material-ui/core/Menu'
import { createStyles, withStyles } from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      background: 'none',
    },
    button: {
      color: 'white',
    },
  })

interface Props {
  menuOpen: boolean
  menuAnchor: MenuProps['anchorEl']
  onOpenMenu: (event) => void
  onCloseMenu: (event) => void
  classes: any
}

const NavUser: React.StatelessComponent<Props> = (props) => {
  const { menuOpen, menuAnchor, onOpenMenu, onCloseMenu, classes } = props

  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar}>
        <AccountCircle />
      </Avatar>

      {menuOpen ? (
        <IconButton
          className={classes.button}
          aria-label="Close"
          color="inherit"
          onClick={onCloseMenu}
        >
          <KeyboardArrowUp />
        </IconButton>
      ) : (
        <IconButton
          className={classes.button}
          aria-label="Open"
          color="inherit"
          onClick={onOpenMenu}
        >
          <KeyboardArrowDown />
        </IconButton>
      )}

      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        getContentAnchorEl={null}
        open={menuOpen}
        onClose={onCloseMenu}
      >
        <MenuItem onClick={onCloseMenu}>Account</MenuItem>
        <MenuItem onClick={onCloseMenu}>My profile</MenuItem>
        <MenuItem onClick={onCloseMenu}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default withStyles(styles)(NavUser)
