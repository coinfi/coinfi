import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '~/bundles/common/components/Icon'
import { borderColor } from './styles'

const styles = (theme) =>
  createStyles({
    icon: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      borderRadius: '2px',
      border: `1px solid ${borderColor}`,
    },
  })

const NewsLabel = ({ classes }) => {
  return (
    <React.Fragment>
      <span>News</span>
      <Icon name="external-link-alt" regular={true} className={classes.icon} />
    </React.Fragment>
  )
}

export default withStyles(styles)(NewsLabel)
