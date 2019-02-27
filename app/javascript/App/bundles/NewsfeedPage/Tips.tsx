import * as React from 'react'
import CallToAction from './CallToAction'
import Icon from '~/bundles/common/components/Icon'
import { withStyles, createStyles } from '@material-ui/core/styles'
const chartIcon = require('~/images/chartIcon.svg') // tslint:disable-line
const filterIcon = require('~/images/filterIcon.svg') // tslint:disable-line
const listIcon = require('~/images/listIcon.svg') // tslint:disable-line

const styles = (theme) =>
  createStyles({
    root: {
      color: theme.palette.text.primary,
      background: theme.palette.background.paper,
      lineHeight: 1.5,
      [theme.breakpoints.down('sm')]: {
        overflowY: 'scroll',
        height: 'calc(100vh - 50px)', // subtract header height
      },
    },
    titleWrapper: {
      borderColor: theme.palette.border.main,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      [theme.breakpoints.up('md')]: {
        height: 60,
      },
      [theme.breakpoints.down('sm')]: {
        minHeight: 60,
      },
      paddingTop: '18px',
    },
    closeTipsWrapper: {
      float: 'right',
      marginRight: '15px',
    },
    title: {
      marginTop: 0,
      fontSize: '1.13rem',
      fontWeight: 700,
      paddingBottom: 10,
      paddingLeft: 15,
      color: `${theme.palette.text.primary} !important`,
    },
    content: {
      padding: '1rem',
    },
    tipsHeader: {
      fontSize: '.88rem',
      color: `${theme.palette.text.primary} !important`,
    },
    tips: {
      listStyleType: 'none',
      padding: 0,
      '& li': {
        margin: '10px 0',
        '& > div': {
          display: 'inline-block',
        },
      },
      '& img': {
        margin: '0 5px',
      },
    },
    listNumber: {
      background: theme.palette.primary.light,
      borderRadius: 40,
      color: theme.palette.text.inverted,
      fontSize: '10px !important',
      marginTop: 2,
      paddingLeft: 6,
      paddingTop: 2,
      verticalAlign: 'top',
      width: 18,
    },
    listText: {
      width: '90%',
      marginLeft: 10,
      fontSize: '.88rem',
    },
  })

interface Props {
  classes: any
  closeTips?: () => void
  loggedIn?: boolean
}

const Tips = ({ closeTips, loggedIn, classes }: Props) => {
  return (
    <div className={classes.root}>
      <div>
        <div className={classes.titleWrapper}>
          <div className={classes.closeTipsWrapper}>
            {closeTips && (
              <Icon name="times" className="f4 slate" onClick={closeTips} />
            )}
          </div>
          <h1 className={classes.title}>
            CoinFi News: Cryptocurrency News Today
          </h1>
        </div>
        <div className={classes.content}>
          <div style={{ fontSize: '.8rem' }}>
            CoinFi News gives crypto investors like you an informational
            advantage by filtering out the noise and showing you how news is
            impacting coin price.
          </div>
          <h4 className={classes.tipsHeader}>Tips:</h4>
          <ol className={classes.tips}>
            <li>
              <div className={classes.listNumber}>1</div>
              <div className={classes.listText}>
                Add coins to your watchlist <img src={listIcon} /> to customize
                your news feed.
              </div>
            </li>
            <li>
              <div className={classes.listNumber}>2</div>
              <div className={classes.listText}>
                Use filters <img src={filterIcon} /> to drill down on specific
                news categories, types, and sources.
              </div>
            </li>
            <li>
              <div className={classes.listNumber}>3</div>
              <div className={classes.listText}>
                Search or click on a coin ticker to view coin-specific news and
                coin data.<img src={chartIcon} />
              </div>
            </li>
            <li>
              <div className={classes.listNumber}>4</div>
              <div className={classes.listText}>
                See how news historically impacts a coin's price using CoinFi's
                Price Chart news annotations.
              </div>
            </li>
            <li>
              <div className={classes.listNumber}>5</div>
              <div className={classes.listText}>
                Enable email and browser notifications to stay up-to-date on the
                latest market moving news.
              </div>
            </li>
          </ol>
        </div>

        {!loggedIn && <CallToAction />}
      </div>
    </div>
  )
}

export default withStyles(styles)(Tips)
