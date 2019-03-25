import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { btn, btnBlue, btnBlueDark } from '~/bundles/common/styles/buttons'
import { openSignUpModal } from '~/bundles/common/utils/modals'
import classnames from 'classnames'

interface Props {
  classes: any
  alignLeft?: boolean
}

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    root: {
      background: theme.palette.background.paper,
      [theme.breakpoints.up('sm')]: {
        borderColor: theme.palette.border.main,
        borderStyle: 'solid',
        borderWidth: '1px',
        width: '90%',
        marginBottom: '25px',
      },
      textAlign: 'center',
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
    rootCenter: {
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    header: {
      paddingTop: '1rem',
      paddingBottom: '1rem',
      borderColor: theme.palette.border.main,
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      [theme.breakpoints.up('sm')]: {
        border: `0 !important`,
      },
      [theme.breakpoints.down('sm')]: {
        paddingTop: '15px',
      },
      color: theme.palette.text.primary,
      fontSize: '1.13rem',
      fontWeight: 'bold',
      margin: 0,
    },
    ctaBtn: {
      ...btn(theme),
      ...(isDarkMode ? btnBlueDark : btnBlue),
      marginTop: '1rem',
      marginBottom: '1rem',
    },
  })
}
const CallToAction = ({ alignLeft, classes }: Props) => {
  return (
    <div
      className={classnames(classes.root, { [classes.rootCenter]: !alignLeft })}
    >
      <h2 className={classes.header}>Get the most out of CoinFi News!</h2>
      <div className="f6">
        Save coins into your Watchlist and be the first to know about the latest
        market moving news.
      </div>
      <button
        className={classes.ctaBtn}
        data-heap="news-click-signup-button"
        onClick={openSignUpModal}
      >
        Sign Up Now
      </button>
    </div>
  )
}

export default withStyles(styles)(CallToAction)
