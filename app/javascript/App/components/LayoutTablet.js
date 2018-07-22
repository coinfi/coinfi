import React, { Fragment } from 'react'

export default function({
  leftSection,
  rightSection,
  drawerSection,
  ...props
}) {
  return (
    <Fragment>
      <div className="bg-white flex flex-column flex-auto">
        <div className="row no-gutter flex-auto">
          <div className="col-xs-6 b--l relative flex flex-column">
            {leftSection}
          </div>
          <div className="col-xs-6 b--l relative overflow-y-auto">
            {rightSection}
          </div>
        </div>
      </div>
      {drawerSection}
    </Fragment>
  )
}
