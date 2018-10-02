import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'

const { Fragment } = React

const styles = (theme) =>
  createStyles({
    root: {},
    section: {
      maxHeight: '100%',
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
    <Fragment>
      <div className="bg-white flex flex-column flex-auto relative">
        <div className="row no-gutter flex-auto">
          <div
            className={`${
              classes.section
            } col-xs-6 b--l relative flex flex-column`}
          >
            {leftSection}
          </div>
          <div
            className={`${
              classes.section
            } col-xs-6 b--l relative overflow-y-auto`}
          >
            {rightSection}
          </div>
        </div>
      </div>
      {drawerSection}
    </Fragment>
  )
}

export default withStyles(styles)(LayoutTablet)
