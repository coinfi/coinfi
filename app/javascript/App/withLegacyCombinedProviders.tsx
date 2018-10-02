import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'

const withLegacyCombinedProviders = (TargetComponent) => {
  const WithLegacyCombinedProviders = (props, railsContext) => {
    return (
      <DeviceProvider {...railsContext.deviceProviderProps}>
        <MuiThemeProvider theme={theme}>
          <CoinListContainer loggedIn={!!props.user}>
            <TargetComponent {...props} />
          </CoinListContainer>
        </MuiThemeProvider>
      </DeviceProvider>
    )
  }

  return WithLegacyCombinedProviders
}

export default withLegacyCombinedProviders
