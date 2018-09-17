import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { default as withLegacyAppReduxContainer } from './containers/app'
import { SizesProvider } from 'react-sizes'
import withReduxStore from './withReduxStore'

const withLegacyCombinedProviders = (TargetComponent) => {
  const WithLegacyCombinedProviders = (props, railsContext) => {
    const TargetComponentWithRedux = withReduxStore(
      withLegacyAppReduxContainer(TargetComponent),
    )

    return (
      <SizesProvider {...railsContext.sizesProviderProps}>
        <MuiThemeProvider theme={theme}>
          <CoinListContainer loggedIn={!!props.user}>
            <TargetComponentWithRedux {...props} />
          </CoinListContainer>
        </MuiThemeProvider>
      </SizesProvider>
    )
  }

  return WithLegacyCombinedProviders
}

export default withLegacyCombinedProviders
