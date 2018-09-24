import * as React from 'react'
import { SizesProvider, default as withSizes } from 'react-sizes'

export interface DeviceContextType {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
}

const DeviceContext = React.createContext<DeviceContextType>(null)

export interface DeviceProviderProps {
  breakpoints: {
    ns: number
    m: number
    l: number
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
      isTablet: width >= breakpoints.m && width < breakpoints.l,
      isDesktop: width >= breakpoints.l,
      screenWidth: width,
      screenHeight: height,
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
