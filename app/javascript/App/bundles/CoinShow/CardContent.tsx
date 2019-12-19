import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { CardContent as MuiCardContent } from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('md')]: {
        paddingLeft: `${theme.spacing.unit * 3}px`,
        paddingRight: `${theme.spacing.unit * 3}px`,
      },
    },
  })

const CardContent = ({ children, classes, className, ...props }) => {
  return (
    <MuiCardContent className={className} classes={classes} {...props}>
      {children}
    </MuiCardContent>
  )
}

export default withStyles(styles)(CardContent)
