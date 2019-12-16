import * as React from 'react'
import { createStyles, withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

const loadingImg = require('~/images/loading.svg') // tslint:disable-line
const styles = (theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
const LoadingIndicator = ({
  className,
  classes,
}: {
  className?: string
  classes: any
}) => {
  return (
    <div className={classnames(classes.root, className)}>
      <img src={loadingImg} alt="" />
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(LoadingIndicator)
