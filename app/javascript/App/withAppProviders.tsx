import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import NewsfeedContainer from '~/bundles/NewsfeedPage/NewsfeedContainer'

/**
 * Wraps `TargetComponent` with providers used by the main App component
 */
const withAppProviders = (TargetComponent) => {
  const WithAppProviders = (props) => {
    return (
      <NewsfeedContainer initialNewsItems={props.initialNewsItems}>
        <CoinListContainer
          loggedIn={!!props.user}
          initialToplistData={props.initialTopCoinsData}
          initialWatchlistData={props.initialWatchedCoinsData}
        >
          <TargetComponent {...props} />
        </CoinListContainer>
      </NewsfeedContainer>
    )
  }

  return WithAppProviders
}

export default withAppProviders
