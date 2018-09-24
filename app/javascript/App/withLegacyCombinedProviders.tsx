import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { default as withLegacyAppReduxContainer } from './containers/app'
import withReduxStore from './withReduxStore'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'

const withLegacyCombinedProviders = (TargetComponent) => {
  const WithLegacyCombinedProviders = (props, railsContext) => {
    const TargetComponentWithRedux = withReduxStore(
      withLegacyAppReduxContainer(TargetComponent),
    )

    return (
      <DeviceProvider {...railsContext.deviceProviderProps}>
        <MuiThemeProvider theme={theme}>
          <CoinListContainer loggedIn={!!props.user}>
            <TargetComponentWithRedux {...props} />
          </CoinListContainer>
        </MuiThemeProvider>
      </DeviceProvider>
    )
  }

  return WithLegacyCombinedProviders
}

export default withLegacyCombinedProviders
