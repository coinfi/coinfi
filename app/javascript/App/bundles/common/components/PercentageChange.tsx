import * as React from 'react'
import { green, sunset } from '~/bundles/common/styles/colors'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

const styles = (theme) =>
  createStyles({
    positiveValue: {
      color: green,
    },
    negativeValue: {
      color: sunset,
    },
  })

interface Props {
  classes: any
  value: string
  className: string
}

const PercentageChange = ({ classes, value, className }: Props) => {
  const n = parseFloat(value)

  if (isNaN(n)) {
    return <div />
  }

  const isPositive = n >= 0
  const klasses = classnames(
    className,
    isPositive ? classes.positiveValue : classes.negativeValue,
  )
  const percentage = `${n}%`
  return <span className={klasses}>{percentage}</span>
}

export default withStyles(styles)(PercentageChange)
