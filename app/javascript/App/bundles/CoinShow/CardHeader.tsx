import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { CardHeader as MuiCardHeader } from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('md')]: {
        paddingLeft: `${theme.spacing.unit * 3}px`,
        paddingRight: `${theme.spacing.unit * 3}px`,
      },
    },
    avatar: {},
    action: {},
    content: {},
    title: {},
    subheader: {},
  })

const CardHeader = ({ children, classes, className, ...props }) => {
  return (
    <MuiCardHeader className={className} classes={classes} {...props}>
      {children}
    </MuiCardHeader>
  )
}

export default withStyles(styles)(CardHeader)
