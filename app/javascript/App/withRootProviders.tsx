import * as React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'
import JssProvider from 'react-jss/lib/JssProvider'
import getOrCreateStylesContext from '~/getOrCreateStylesContext'
import ClearJssServerSide from '~/ClearJssServerSide'
import { CookiesProvider } from 'react-cookie'
import { CurrencyProvider } from './bundles/common/contexts/CurrencyContext'

interface WithClientProvidersOptions {
  stylesNamespace?: string
}

/**
 * Wraps `TargetComponent` with providers shared by all client components
 */
const withRootProviders = (
  TargetComponent,
  options: WithClientProvidersOptions = {},
) => {
  const WithRootProviders = (props, railsContext) => {
    const stylesNamespace = props.stylesNamespace || options.stylesNamespace
    const stylesContext = getOrCreateStylesContext(stylesNamespace)

    return (
      <CookiesProvider>
        <JssProvider
          registry={stylesContext.sheetsRegistry}
          generateClassName={stylesContext.generateClassName}
        >
          <MuiThemeProvider
            theme={theme}
            sheetsManager={stylesContext.sheetsManager}
          >
            <ClearJssServerSide stylesNamespace={stylesNamespace}>
              <RailsProvider railsContext={railsContext}>
                <DeviceProvider {...railsContext.deviceProviderProps}>
                  <CurrencyProvider>
                    <TargetComponent {...props} />
                  </CurrencyProvider>
                </DeviceProvider>
              </RailsProvider>
            </ClearJssServerSide>
          </MuiThemeProvider>
        </JssProvider>
      </CookiesProvider>
    )
  }

  return WithRootProviders
}

export default withRootProviders
