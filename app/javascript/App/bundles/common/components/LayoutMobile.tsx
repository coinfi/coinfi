import * as React from 'react'

export default function({ mainSection, modalSection, drawerSection }) {
  return (
    <>
      <div className="bg-white relative flex-auto flex flex-column">
        {mainSection}
      </div>
      {modalSection}
      {drawerSection}
    </>
  )
}
