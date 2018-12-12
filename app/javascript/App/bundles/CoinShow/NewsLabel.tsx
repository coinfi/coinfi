import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '~/bundles/common/components/Icon'

const styles = (theme) =>
  createStyles({
    icon: {
      marginLeft: '0.25rem',
      marginBottom: '0.25rem',
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
