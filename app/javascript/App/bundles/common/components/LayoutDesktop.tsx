import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

const styles = (theme) =>
  createStyles({
    root: {},
    container: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
    },
    section: {
      maxHeight: '100%',
      position: 'relative',
      borderColor: theme.palette.border.main,
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      borderLeftStyle: 'solid',
      borderLeftWidth: '1px',
      WebkitFlexBasis: '16.666%',
      MsFlexPreferredSize: '16.666%',
      flexBasis: '16.666%',
      maxWidth: '16.666%',
    },
    centerSection: {
      display: 'flex',
      flexDirection: 'column',
      borderLeftStyle: 'solid',
      borderLeftWidth: '1px',
      WebkitFlexBasis: '41.667%',
      MsFlexPreferredSize: '41.667%',
      flexBasis: '41.667%',
      maxWidth: '41.667%',
    },
    rightSection: {
      overflowY: 'auto',
      borderLeftStyle: 'solid',
      borderLeftWidth: '1px',
      borderRightStyle: 'solid',
      borderRightWidth: '1px',
      WebkitFlexBasis: '41.667%',
      MsFlexPreferredSize: '41.667%',
      flexBasis: '41.667%',
      maxWidth: '41.667%',
    },
  })

const LayoutDesktop = ({
  classes,
  leftSection,
  centerSection,
  rightSection,
  ...props
}) => {
  return (
    <div className={classes.container}>
      <div className="row no-gutter flex-auto">
        <div className={classnames(classes.section, classes.leftSection)}>
          {leftSection}
        </div>
        <div className={classnames(classes.section, classes.centerSection)}>
          {centerSection}
        </div>
        <div className={classnames(classes.section, classes.rightSection)}>
          {rightSection}
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(LayoutDesktop)
