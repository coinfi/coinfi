import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { Card } from '@material-ui/core'
import { borderColor } from '~/bundles/common/styles/colors'

const styles = (theme) =>
  createStyles({
    root: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      width: '100%',
      borderRadius: '2px',
      border: `1px solid ${borderColor}`,
    },
  })

const SubCard = ({ children, classes, className, ...props }) => {
  const classNames = classnames(classes.root, className)
  return (
    <Card
      raised={false}
      square={true}
      elevation={0}
      className={classNames}
      classes={classes}
      {...props}
    >
      {children}
    </Card>
  )
}

export default withStyles(styles)(SubCard)
