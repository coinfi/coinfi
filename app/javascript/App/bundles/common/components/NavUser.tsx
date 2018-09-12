import * as React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import { createStyles, withStyles, withTheme } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import { MenuProps } from '@material-ui/core/Menu'
import { PROFILE_EDIT_URL, LOGOUT_URL } from '~/constants'

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
      width: 'auto',
      fontSize: 20,
    },
    menuPaper: {
      borderRadius: 0,
      backgroundColor: '#071d29',
    },
    menuHeadingItem: {
      color: 'white',
      lineHeight: '24px',
      paddingLeft: 12,
      paddingRight: 48,
    },
    menuAccountLabel: {},
    menuEmail: {
      color: 'rgba(255, 255, 255, .7)',
    },
    menuList: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    menuItem: {
      height: 10,
      lineHeight: '10px',
      color: 'white',
      fontSize: 14,
      fontWeight: 500,
      minWidth: 150,
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
  formAuthenticityToken: string
  userEmail: string
  classes: any
}

const NavUser: React.StatelessComponent<Props> = (props) => {
  const {
    menuOpen,
    menuAnchor,
    onOpenMenu,
    onCloseMenu,
    formAuthenticityToken,
    userEmail,
    classes,
  } = props

  const LogoutButton = (logoutButtonProps) => (
    <form method="post" action={LOGOUT_URL}>
      <input type="hidden" name="_method" value="delete" />
      <button type="submit" {...logoutButtonProps} />
      <input
        type="hidden"
        name="authenticity_token"
        value={formAuthenticityToken}
      />
    </form>
  )

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
          <KeyboardArrowUp fontSize="inherit" />
        </IconButton>
      ) : (
        <IconButton
          className={classes.button}
          disableRipple={true}
          aria-label="Open"
          color="inherit"
          onClick={onOpenMenu}
        >
          <KeyboardArrowDown fontSize="inherit" />
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
        <ListSubheader className={classes.menuHeadingItem}>
          <div className={classes.menuAccountLabel}>Account</div>
          <div className={classes.menuEmail}>{userEmail}</div>
        </ListSubheader>

        <Divider className={classes.menuDivider} />

        <a href={PROFILE_EDIT_URL}>
          <MenuItem className={classes.menuItem}>My profile</MenuItem>
        </a>

        <MenuItem component={LogoutButton} className={classes.menuItem}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

export default withTheme()(withStyles(styles)(NavUser))
