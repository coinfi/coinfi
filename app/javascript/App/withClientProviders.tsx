import * as React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'
import { createGenerateClassName } from '@material-ui/core/styles'
import JssProvider from 'react-jss/lib/JssProvider'

const generateClassName = createGenerateClassName({
  // Attempt to use global css for more deterministic class names to resolve mismatches between
  // client and server rendering
  dangerouslyUseGlobalCSS: true,
})

/**
 * Wraps `TargetComponent` with providers shared by all client components
 */
const withClientProviders = (TargetComponent) => {
  const WithClientProviders = (props, railsContext) => {
    return (
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <RailsProvider railsContext={railsContext}>
            <DeviceProvider {...railsContext.deviceProviderProps}>
              <TargetComponent {...props} />
            </DeviceProvider>
          </RailsProvider>
        </MuiThemeProvider>
      </JssProvider>
    )
  }

  return WithClientProviders
}

export default withClientProviders
