import * as React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Button, Paper, Typography, Grid } from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    mainFeaturedPost: {
      backgroundColor: '#253640',
      color: '#d7d7d7',
      boxShadow: 'none',
    },
    mainFeaturedPostContent: {
      padding: `${theme.spacing.unit * 4}px`,
      [theme.breakpoints.up('md')]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    header: {
      marginBottom: '0.5em !important',
      fontSize: '24px',
      fontWeight: 500,
      textAlign: 'center',
    },
    subheader: {
      fontSize: '0.8rem',
      textAlign: 'center',
      [theme.breakpoints.up('md')]: {
        fontSize: '1rem',
      },
    },
    cta: {
      backgroundColor: '#23adf0',
      color: '#fff',
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: '#23adf0',
        boxShadow: '0 2px 10px rgba(14, 151, 255, 0.4)',
      },
    },
  })

const Banner = ({ classes, className }) => {
  const rootClasses = classnames(className, classes.mainFeaturedPost)
  return (
    <Paper className={rootClasses} square={true}>
      <Grid
        container={true}
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.mainFeaturedPostContent}
      >
        <Grid item={true} md={true}>
          <Typography className={classes.header} color="inherit">
            Financial intelligence for cryptocurrency
          </Typography>
        </Grid>
        <Grid item={true} md={true}>
          <Typography
            className={classes.subheader}
            color="inherit"
            paragraph={true}
          >
            Uncover buy and sell opportunities through data science backed
            blockchain analytics.
          </Typography>
        </Grid>
        <Grid item={true} md={true}>
          <Button
            className={classes.cta}
            data-heap="homepage-click-signals-cta"
            onClick={() => {
              window.location.href = `/signals`
            }}
          >
            Learn more
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default withStyles(styles)(Banner)
