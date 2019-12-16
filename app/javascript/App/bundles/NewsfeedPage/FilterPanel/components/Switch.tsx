import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import switchStyle from '~/bundles/common/styles/components/switch'
import classnames from 'classnames'

const styles = (theme) => {
  return createStyles({
    ...switchStyle(theme),
  })
}

const Switch = (props) => {
  const { on, classes } = props
  return (
    <button
      className={classnames(classes.switch, { [classes.on]: !!on })}
      onClick={props.onChange}
    />
  )
}

export default withStyles(styles)(Switch)
