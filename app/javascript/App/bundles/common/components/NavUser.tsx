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
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {
  LOGIN_URL,
  LOGOUT_URL,
  PROFILE_EDIT_URL,
  REGISTRATION_URL,
} from '~/constants'
import {
  withThemeType,
  ThemeContextType,
} from '~/bundles/common/contexts/ThemeContext'
import { pearlGray } from '../styles/colors'

const styles = (theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      background: 'none',
      color: pearlGray,
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
      paddingLeft: 16,
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
    darkModeLabel: {
      color: 'white',
      fontSize: 14,
      fontWeight: 500,
    },
  })

interface Props extends ThemeContextType {
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
    isDarkMode,
    toggleTheme,
  } = props

  const isLoggedIn = !!userEmail

  const DarkModeToggle = () => (
    <FormControlLabel
      control={
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          value={isDarkMode}
          color="default"
        />
      }
      labelPlacement="start"
      label="Dark Mode"
      classes={{ label: classes.darkModeLabel }}
    />
  )

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

  const LoggedInMenu = [
    <ListSubheader className={classes.menuHeadingItem} key={1}>
      <div className={classes.menuAccountLabel}>Account</div>
      <div className={classes.menuEmail}>{userEmail}</div>
    </ListSubheader>,
    <DarkModeToggle key={2} />,
    <Divider className={classes.menuDivider} key={3} />,
    <a href={PROFILE_EDIT_URL} key={4}>
      <MenuItem className={classes.menuItem}>My profile</MenuItem>
    </a>,
    <MenuItem component={LogoutButton} className={classes.menuItem} key={5}>
      Logout
    </MenuItem>,
  ]

  const LoggedOutMenu = [
    <DarkModeToggle key={1} />,
    <Divider className={classes.menuDivider} key={2} />,
    <a href={REGISTRATION_URL} key={3}>
      <MenuItem className={classes.menuItem}>Sign Up</MenuItem>
    </a>,
    <a href={LOGIN_URL} key={4}>
      <MenuItem className={classes.menuItem}>Login</MenuItem>
    </a>,
  ]

  return (
    <div className={classes.root}>
      {isLoggedIn && (
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
      )}

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
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        open={menuOpen}
        onClose={onCloseMenu}
      >
        {isLoggedIn ? LoggedInMenu : LoggedOutMenu}
      </Menu>
    </div>
  )
}

export default withTheme()(withStyles(styles)(withThemeType(NavUser)))
