import React from 'react'

export default function({
  leftSection,
  centerSection,
  rightSection,
  ...props
}) {
  return (
    <div className="flex flex-column flex-auto">
      <div className="row no-gutter flex-auto bg-white">
        <div className="col-xs-2 relative flex flex-column b--l">
          {leftSection}
        </div>
        <div className="col-xs-5 relative flex flex-column b--l">
          {centerSection}
        </div>
        <div className="col-xs-5 relative overflow-y-auto b--l b--r">
          {rightSection}
        </div>
      </div>
    </div>
  )
}
