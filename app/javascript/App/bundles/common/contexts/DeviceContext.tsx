import * as React from 'react'
import { SizesProvider, default as withSizes } from 'react-sizes'

export interface DeviceContextType {
  isMobile: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  isServerMobile: boolean
  isServerDesktop: boolean
}

const DeviceContext = React.createContext<DeviceContextType>(null)

export interface DeviceProviderProps {
  breakpoints: {
    m: number
  }
  fallback: {
    width: number
    height: number
  }
}

export const DeviceProvider: React.StatelessComponent<DeviceProviderProps> = ({
  fallback,
  breakpoints,
  children,
}) => {
  const sizesProviderConfig = {
    fallbackWidth: fallback.width,
    fallbackHeight: fallback.height,
  }
  const mapSizesToProps = ({ width, height }) => ({
    value: {
      isMobile: width < breakpoints.m,
      isDesktop: width >= breakpoints.m,
      screenWidth: width,
      screenHeight: height,
      isServerMobile: fallback.width < breakpoints.m,
      isServerDesktop: fallback.width >= breakpoints.m,
    },
  })

  const EnhancedDeviceContextProvider = withSizes(mapSizesToProps)(
    DeviceContext.Provider,
  )

  return (
    <SizesProvider config={sizesProviderConfig}>
      <EnhancedDeviceContextProvider>{children}</EnhancedDeviceContextProvider>
    </SizesProvider>
  )
}

export const DeviceConsumer = DeviceContext.Consumer
