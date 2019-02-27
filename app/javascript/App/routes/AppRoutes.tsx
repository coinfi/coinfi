import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import ExchangeListingsPage from '~/bundles/ExchangeListings/ExchangeListingsCointainer'
import NewsfeedPageContainer from '~/bundles/NewsfeedPage/NewsfeedPageContainer'
import CoinIndex from '../bundles/CoinIndex'
import HomeIndex from '../bundles/HomeIndex'
import CoinShow from '../bundles/CoinShow'
import TokenMetricsIndex from '../bundles/TokenMetricsIndex'

const AppRoutes = (props) => {
  return (
    <Switch>
      <Route exact={true} path="/" render={() => <HomeIndex {...props} />} />
      <Route
        exact={true}
        path="/news/:coinSlug?"
        render={(routeProps) => (
          <NewsfeedPageContainer
            user={props.user}
            loggedIn={!!props.user}
            coinSlug={routeProps.match.params.coinSlug}
            topCoinSlugs={props.topCoinSlugs}
            categories={props.categories}
            feedSources={props.feedSources}
            initialCoinWithDetails={props.initialCoinWithDetails}
            initialTheme={props.initialTheme}
          />
        )}
      />
      <Route
        exact={true}
        path="/news/:newsItemId/:newsItemSlug"
        render={(routeProps) => (
          <NewsfeedPageContainer
            user={props.user}
            loggedIn={!!props.user}
            newsItemId={routeProps.match.params.newsItemId}
            topCoinSlugs={props.topCoinSlugs}
            categories={props.categories}
            feedSources={props.feedSources}
            initialNewsItem={props.initialNewsItem}
            initialTheme={props.initialTheme}
          />
        )}
      />
      <Route
        exact={true}
        path="/listings"
        render={() => <ExchangeListingsPage {...props} />}
      />
      <Route
        exact={true}
        path="/coins"
        render={() => <CoinIndex {...props} />}
      />
      <Route
        exact={true}
        path="/coins/:coinSlug"
        render={(routeProps) => <CoinShow {...props} />}
      />
      <Route
        exact={true}
        path="/token-metrics/:metricType?"
        render={(routeProps) => <TokenMetricsIndex {...props} />}
      />
    </Switch>
  )
}

export default AppRoutes
