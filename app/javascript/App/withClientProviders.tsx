import * as React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'
import JssProvider from 'react-jss/lib/JssProvider'
import createStylesContext from '~/createStylesContext'

const sharedStylesContext = createStylesContext()
const clientOnlyStylesContext = createStylesContext('client')

interface WithClientProvidersOptions {
  clientOnly?: boolean
}

/**
 * Wraps `TargetComponent` with providers shared by all client components
 */
const withClientProviders = (
  TargetComponent,
  options: WithClientProvidersOptions = {},
) => {
  const stylesContext = options.clientOnly
    ? clientOnlyStylesContext
    : sharedStylesContext

  const WithClientProviders = (props, railsContext) => {
    return (
      <JssProvider
        registry={stylesContext.sheetsRegistry}
        generateClassName={stylesContext.generateClassName}
      >
        <MuiThemeProvider
          theme={theme}
          sheetsManager={stylesContext.sheetsManager}
        >
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
