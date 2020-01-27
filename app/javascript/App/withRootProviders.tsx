import * as React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'
import JssProvider from 'react-jss/lib/JssProvider'
import getOrCreateStylesContext from '~/getOrCreateStylesContext'
import ClearJssServerSide from '~/ClearJssServerSide'
import { CookiesProvider } from 'react-cookie'
import { UserSettingsProvider } from './bundles/common/contexts/UserSettingsContext'

interface WithClientProvidersOptions {
  stylesNamespace?: string
  stylesContextStore?: any
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
    const stylesContextStore = options.stylesContextStore || {}
    const stylesContext = getOrCreateStylesContext(
      stylesNamespace,
      stylesContextStore,
    )

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
                  <UserSettingsProvider {...props}>
                    <TargetComponent {...props} />
                  </UserSettingsProvider>
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
