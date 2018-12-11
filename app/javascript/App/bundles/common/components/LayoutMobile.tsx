import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = (theme) =>
  createStyles({
    modal: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflowY: 'auto',
      zIndex: 999,
      background: 'white',
    },
  })

const LayoutMobile = ({
  classes,
  mainSection,
  modalSection,
  drawerSection,
  showModal,
}) => {
  return (
    <>
      <div className="bg-white relative flex-auto flex flex-column">
        {mainSection}
      </div>
      {!!showModal && <div className={classes.modal}>{modalSection}</div>}
      {drawerSection}
    </>
  )
}

export default withStyles(styles)(LayoutMobile)
