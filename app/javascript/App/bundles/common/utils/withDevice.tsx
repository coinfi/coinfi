import * as React from 'react'
import { DeviceConsumer } from '../contexts/DeviceContext'

const withDevice = (TargetComponent) => {
  const WithDevice = (props) => (
    <DeviceConsumer>
      {(context) => <TargetComponent {...props} {...context} />}
    </DeviceConsumer>
  )

  return WithDevice
}

export default withDevice
