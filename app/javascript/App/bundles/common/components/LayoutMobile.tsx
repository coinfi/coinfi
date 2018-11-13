import * as React from 'react'
import styled from 'styled-components'

const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  z-index: 999;
  background: white;
`

export default function({
  mainSection,
  modalSection,
  drawerSection,
  showModal,
}) {
  return (
    <>
      <div className="bg-white relative flex-auto flex flex-column">
        {mainSection}
      </div>
      {!!showModal && <Modal>{modalSection}</Modal>}
      {drawerSection}
    </>
  )
}
