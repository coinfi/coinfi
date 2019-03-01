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
      position: 'relative',
    },
    section: {
      maxHeight: '100%',
      WebkitFlexBasis: '50%',
      MsFlexPreferredSize: '50%',
      flexBasis: '50%',
      maxWidth: '50%',
      borderColor: theme.palette.border.main,
      borderLeftStyle: 'solid',
      borderLeftWidth: '1px',
      position: 'relative',
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
    },
    rightSection: {
      overflowY: 'auto',
    },
  })

const LayoutTablet = ({
  classes,
  leftSection,
  rightSection,
  drawerSection,
  ...props
}) => {
  return (
    <>
      <div className={classes.container}>
        <div className="row no-gutter flex-auto">
          <div className={classnames(classes.section, classes.leftSection)}>
            {leftSection}
          </div>
          <div className={classnames(classes.section, classes.rightSection)}>
            {rightSection}
          </div>
        </div>
      </div>
      {drawerSection}
    </>
  )
}

export default withStyles(styles)(LayoutTablet)
