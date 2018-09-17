import * as React from 'react'
import { SizesProvider, default as withSizes } from 'react-sizes'

export interface DeviceContextType {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const DeviceContext = React.createContext<DeviceContextType>(null)

interface Props {
  fallbackDeviceWidth: number
  fallbackDeviceHeight: number
}

export const DeviceProvider: React.StatelessComponent<Props> = (props) => {
  const sizesProviderConfig = {
    fallbackWidth: props.fallbackDeviceWidth,
    fallbackHeight: props.fallbackDeviceHeight,
  }
  const mapSizesToProps = (sizes) => ({
    value: {
      isMobile: withSizes.isMobile(sizes),
      isTablet: withSizes.isTablet(sizes),
      isDesktop: withSizes.isDesktop(sizes),
    },
  })

  const EnhancedDeviceContextProvider = withSizes(mapSizesToProps)(
    DeviceContext.Provider,
  )

  return (
    <SizesProvider config={sizesProviderConfig}>
      <EnhancedDeviceContextProvider>
        {props.children}
      </EnhancedDeviceContextProvider>
    </SizesProvider>
  )
}

export const DeviceConsumer = DeviceContext.Consumer
