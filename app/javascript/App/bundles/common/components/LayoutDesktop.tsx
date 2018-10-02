import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = (theme) =>
  createStyles({
    root: {},
    section: {
      maxHeight: '100%',
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
    <div className="flex flex-column flex-auto column-wrap">
      <div className="row no-gutter flex-auto bg-white">
        <div
          className={`${
            classes.section
          } col-xs-2 relative flex flex-column b--l`}
        >
          {leftSection}
        </div>
        <div
          className={`${
            classes.section
          } col-xs-5 relative flex flex-column b--l`}
        >
          {centerSection}
        </div>
        <div
          className={`${
            classes.section
          } col-xs-5 relative overflow-y-auto b--l b--r`}
        >
          {rightSection}
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(LayoutDesktop)
