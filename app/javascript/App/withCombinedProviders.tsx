import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import NewsfeedContainer from '~/bundles/NewsfeedPage/NewsfeedContainer'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'

const withCombinedProviders = (TargetComponent) => {
  const WithCombinedProviders = (props, railsContext) => {
    return (
      <RailsProvider railsContext={railsContext}>
        <DeviceProvider {...railsContext.deviceProviderProps}>
          <NewsfeedContainer initialNewsItems={props.initialNewsItems}>
            <CoinListContainer
              loggedIn={!!props.user}
              initialToplistData={props.initialTopCoinsData}
              initialWatchlistData={props.initialWatchedCoinsData}
            >
              <TargetComponent {...props} />
            </CoinListContainer>
          </NewsfeedContainer>
        </DeviceProvider>
      </RailsProvider>
    )
  }

  return WithCombinedProviders
}

export default withCombinedProviders
