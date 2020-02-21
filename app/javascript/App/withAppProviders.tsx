import * as React from 'react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import NewsfeedContainer from '~/bundles/NewsfeedPage/NewsfeedContainer'
import { CurrencyProvider } from '~/bundles/common/contexts/CurrencyContext'

/**
 * Wraps `TargetComponent` with providers used by the main App component
 */
const withAppProviders = (TargetComponent) => {
  const WithAppProviders = (props) => {
    return (
      <NewsfeedContainer
        initialNewsItems={props.initialNewsItems}
        initialNewsItem={props.initialNewsItem}
        initialVotes={props.initialVotes}
      >
        <CoinListContainer
          loggedIn={!!props.user}
          initialToplistData={props.initialTopCoinsData}
          initialWatchlistData={props.initialWatchedCoinsData}
        >
          <CurrencyProvider {...props}>
            <TargetComponent {...props} />
          </CurrencyProvider>
        </CoinListContainer>
      </NewsfeedContainer>
    )
  }

  return WithAppProviders
}

export default withAppProviders
