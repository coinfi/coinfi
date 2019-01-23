import * as React from 'react'
import { DeviceConsumer, DeviceContextType } from '../contexts/DeviceContext'

const withDevice = (TargetComponent) => {
  const WithDevice = (props) => (
    <DeviceConsumer>
      {(context: DeviceContextType) => (
        <TargetComponent {...props} {...context} />
      )}
    </DeviceConsumer>
  )

  return WithDevice
}

// export context interface for easy access
export { DeviceContextType } from '../contexts/DeviceContext'

export default withDevice
