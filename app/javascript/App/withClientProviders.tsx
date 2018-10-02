import * as React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'

/**
 * Wraps `TargetComponent` with providers shared by all client components
 */
const withClientProviders = (TargetComponent) => {
  const WithClientProviders = (props, railsContext) => {
    return (
      <MuiThemeProvider theme={theme}>
        <RailsProvider railsContext={railsContext}>
          <DeviceProvider {...railsContext.deviceProviderProps}>
            <TargetComponent {...props} />
          </DeviceProvider>
        </RailsProvider>
      </MuiThemeProvider>
    )
  }

  return WithClientProviders
}

export default withClientProviders
