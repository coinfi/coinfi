import * as React from 'react'
import { createStyles, withStyles } from '@material-ui/core'
import withDevice, {
  DeviceContextType,
} from '~/bundles/common/utils/withDevice'
import compose from 'recompose/compose'

interface Props extends DeviceContextType {
  classes: any
}

const styles = (theme) =>
  createStyles({
    footer: {
      height: '196px',
      width: '100%',
      backgroundColor: '#071d29',
      color: '#fff',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '12px',
        paddingRight: '12px',
      },
    },
    footerWrapper: {
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
    },
    logoFooter: {
      paddingTop: '2rem',
    },
    social: {
      paddingTop: '0.5rem',
      '& a': {
        textDecoration: 'none',
        border: 0,
        padding: '1rem .5rem',
        [theme.breakpoints.down('sm')]: {
          lineHeight: '2rem',
        },
      },
      [theme.breakpoints.down('sm')]: {
        paddingBottom: '0.5rem',
      },
    },
  })

const Footer: React.StatelessComponent<Props> = ({ classes }) => {
  const currentYear = new Date().getFullYear()
  return (
    <div className={classes.footer}>
      <div className={classes.footerWrapper}>
        <div className={classes.logoFooter}>
          <img src="/img/logo.svg" />
        </div>

        <p>Copyright © {currentYear} CoinFi - All rights reserved.</p>

        <div className={classes.social}>
          <a href="/coins" className="pv1">
            Coins
          </a>
          <a href="/icos" className="pv1">
            ICOs
          </a>
          <a href="/calculators/bitcoin-investment-calculator">
            Bitcoin Investment Calculator
          </a>
          <a
            href="https://www.facebook.com/CoinFiProject/"
            className="pv1 ph2"
            target="_blank"
          >
            <img height="20" width="20" src="/img/icon-facebook.svg" />
          </a>
          <a
            href="https://twitter.com/coin_fi"
            className="pv1 ph2"
            target="_blank"
          >
            <img height="20" width="20" src="/img/icon-twitter.svg" />
          </a>
          <a
            href="https://www.linkedin.com/company/coinfi/"
            className="pv1 ph2"
            target="_blank"
          >
            <img height="20" width="20" src="/img/icon-linkedin.svg" />
          </a>
          <a href="https://angel.co/coinfi" className="pv1 ph2" target="_blank">
            <img height="20" width="20" src="/img/icon-angellist.svg" />
          </a>
          <a
            href="https://github.com/coinfi"
            className="pv1 ph2"
            target="_blank"
          >
            <img height="20" width="20" src="/img/icon-github.svg" />
          </a>
          <a
            href="https://heapanalytics.com/?utm_source=badge"
            className="pv1 ph2"
            rel="nofollow"
          >
            <img
              style={{ marginTop: '4px', height: '24px' }}
              src="//heapanalytics.com/img/badgeLight.png"
              alt="Heap | Mobile and Web Analytics"
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default compose(
  withDevice,
  withStyles(styles),
)(Footer)
