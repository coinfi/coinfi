import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import NewsfeedContainer from '~/bundles/NewsfeedPage/NewsfeedContainer'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'

const withCombinedProviders = (TargetComponent) => {
  const WithCombinedProviders = (props, railsContext) => {
    return (
      <MuiThemeProvider theme={theme}>
        <DeviceProvider {...railsContext.deviceProviderProps}>
          <NewsfeedContainer
            initialNewsItems={props.initialNewsItems}
          >
            <CoinListContainer
              loggedIn={!!props.user}
              initialToplistData={props.initialTopCoinsData}
              initialWatchlistData={props.initialWatchedCoinsData}
            >
              <TargetComponent {...props} />
            </CoinListContainer>
          </NewsfeedContainer>
        </DeviceProvider>
      </MuiThemeProvider>
    )
  }

  return WithCombinedProviders
}

export default withCombinedProviders
