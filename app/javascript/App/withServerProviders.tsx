import * as React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'
import JssProvider from 'react-jss/lib/JssProvider'
import ClearJssServerSide from '~/ClearJssServerSide'
import getOrCreateStylesContext from '~/getOrCreateStylesContext'

interface WithServerProvidersOptions {
  stylesNamespace?: string
}

/**
 * Wraps `TargetComponent` with providers shared by all server components
 */
const withServerProviders = (
  TargetComponent,
  options: WithServerProvidersOptions = {},
) => {
  const WithServerProviders = (props, railsContext) => {
    const stylesNamespace = props.stylesNamespace || options.stylesNamespace
    const stylesContext = getOrCreateStylesContext(stylesNamespace)

    return (
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
                <TargetComponent {...props} />
              </DeviceProvider>
            </RailsProvider>
          </ClearJssServerSide>
        </MuiThemeProvider>
      </JssProvider>
    )
  }

  return WithServerProviders
}

export default withServerProviders
