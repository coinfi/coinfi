import * as React from 'react'
import { Avatar, Divider, IconButton, Menu, MenuItem } from '@material-ui/core'
import {
  AccountCircle,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@material-ui/icons'
import { MenuProps } from '@material-ui/core/Menu'
import { createStyles, withStyles, withTheme } from '@material-ui/core'

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
    menuPaper: {
      borderRadius: 0,
      backgroundColor: '#071d29',
    },
    menuList: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    menuItem: {
      height: 10,
      color: 'white',
      fontSize: 14,
      fontWeight: 500,
      paddingRight: 48,
    },
    menuDivider: {
      backgroundColor: 'rgba(255, 255, 255, .3)',
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
        classes={{
          paper: classes.menuPaper,
        }}
        MenuListProps={{
          className: classes.menuList,
        }}
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        getContentAnchorEl={null}
        open={menuOpen}
        onClose={onCloseMenu}
      >
        <MenuItem className={classes.menuItem} onClick={onCloseMenu}>
          Account
        </MenuItem>
        <Divider className={classes.menuDivider} />
        <MenuItem className={classes.menuItem} onClick={onCloseMenu}>
          My profile
        </MenuItem>
        <MenuItem className={classes.menuItem} onClick={onCloseMenu}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

export default withTheme()(withStyles(styles)(NavUser))
