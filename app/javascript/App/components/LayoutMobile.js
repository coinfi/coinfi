import React, { Fragment } from 'react'

export default function({
  activeEntity,
  currentUI,
  modalName,
  mainSection,
  modalSection,
  drawerSection,
  ...props
}) {
  return (
    <Fragment>
      <div className="bg-white relative flex-auto flex flex-column">
        {mainSection}
      </div>
      {activeEntity &&
        currentUI(modalName) && (
          <Fragment>
            <div className="modal bg-black-70 pt5 vw100">{modalSection}</div>
            <div />
          </Fragment>
        )}
      {drawerSection}
    </Fragment>
  )
}
