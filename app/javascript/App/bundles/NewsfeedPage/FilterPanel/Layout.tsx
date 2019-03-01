import * as React from 'react'
import classnames from 'classnames'
import withDevice from '~/bundles/common/utils/withDevice'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  btn,
  btnXs,
  btnWhite,
  btnWhiteDark,
  btnBlue,
} from '~/bundles/common/styles/buttons'

interface Props {
  classes: any
  closeFilterPanel: () => void
  resetFilters: () => void
  applyFilters: () => void
  children: any
  newsFeedStyle?: boolean
  isMobile: boolean
}

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    container: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      '& h1, h2, h3, h4, h5': {
        color: theme.palette.text.heading,
      },
    },
    mobileContainer: {},
    nonMobileContainer: {},
    headerWrapper: {
      borderColor: theme.palette.border.accent,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      padding: '1rem',
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    header: {
      marginTop: 0,
      marginBottom: 0,
      marginRight: '0.25rem',
      fontWeight: 'bold',
    },
    closeBtn: {
      ...btn(theme),
      ...btnXs(theme),
      ...(isDarkMode ? btnWhiteDark : btnWhite),
      background: 'none !important',
      border: 'none !important',
      boxShadow: 'none !important',
      color: `${theme.palette.primary.light} !important`,
      fontSize: '14px !important',
      textTransform: 'none',
    },
    cancelBtn: {
      ...btn(theme),
      ...btnXs(theme),
      ...(isDarkMode ? btnWhiteDark : btnWhite),

      background: 'none !important',
      border: 'none !important',
      boxShadow: 'none !important',
      color: `${theme.palette.text.secondary} !important`,
      fontSize: '14px !important',
      textTransform: 'none',
    },
    applyBtn: {
      ...btn(theme),
      ...btnXs(theme),
      ...btnBlue,
      marginLeft: '1rem',
      fontSize: '.88rem !important',
      padding: '8px 20px',
      textTransform: 'none',
    },
  })
}

const Layout = (props: Props) => {
  const { classes, isMobile } = props
  return (
    <div
      className={classnames(
        classes.container,
        { modal: isMobile },
        { 'overlay z-999 overflow-y-auto': !isMobile },
      )}
    >
      <div className={classes.headerWrapper}>
        <div className="flex items-center">
          <h3 className={classes.header}>Filters</h3>
          <button className={classes.closeBtn} onClick={props.resetFilters}>
            Reset
          </button>
        </div>
        <div>
          <button
            className={classes.cancelBtn}
            onClick={props.closeFilterPanel}
          >
            Cancel
          </button>
          <button className={classes.applyBtn} onClick={props.applyFilters}>
            Apply
          </button>
        </div>
      </div>
      <div
        className="ph3 ph4-l"
        // @ts-ignore
        style={!!props.newsFeedStyle ? { padding: '1rem' } : {}}
      >
        {props.children}
      </div>
    </div>
  )
}

export default withStyles(styles)(withDevice(Layout))
