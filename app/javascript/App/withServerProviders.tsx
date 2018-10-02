import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import NewsfeedContainer from '~/bundles/NewsfeedPage/NewsfeedContainer'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'
import JssProvider from 'react-jss/lib/JssProvider'
import { SheetsRegistry, GenerateClassName } from 'jss'

interface WithServerProvidersOptions {
  sheetsRegistry: SheetsRegistry
  sheetsManager: Map<any, any>
  generateClassName: GenerateClassName<any>
}

/**
 * Wraps `TargetComponent` with providers shared by all server components
 */
const withServerProviders = (
  TargetComponent,
  {
    sheetsRegistry,
    sheetsManager,
    generateClassName,
  }: WithServerProvidersOptions,
) => {
  const WithServerProviders = (props, railsContext) => {
    return (
      <JssProvider
        registry={sheetsRegistry}
        generateClassName={generateClassName}
      >
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <RailsProvider railsContext={railsContext}>
            <DeviceProvider {...railsContext.deviceProviderProps}>
              <TargetComponent {...props} />
            </DeviceProvider>
          </RailsProvider>
        </MuiThemeProvider>
      </JssProvider>
    )
  }

  return WithServerProviders
}

export default withServerProviders
