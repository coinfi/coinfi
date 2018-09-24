import * as React from 'react'
import Drawer from './Drawer'
import Icon from './../../../components/Icon'

interface Props {
  isShown: boolean
  onClose: () => void
  bodySection: any
}

const BodySectionDrawer = (props: Props) => (
  <Drawer
    {...props}
    position="bottom"
    className="overflow-y-auto flex flex-column"
    onClose={props.onClose}
    isShown={props.isShown}
  >
    <div className="flex-none pv4 tc" onClick={props.onClose}>
      <Icon name="times" className="f4 slate" regular={true} />
    </div>
    <div className="flex-auto bg-white relative">{props.bodySection}</div>
  </Drawer>
)

export default BodySectionDrawer
