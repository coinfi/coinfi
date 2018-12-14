import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import ExchangeListingsPage from '~/bundles/ExchangeListings/ExchangeListingsCointainer'
import NewsfeedPageContainer from '~/bundles/NewsfeedPage/NewsfeedPageContainer'
import CoinIndex from '../bundles/CoinIndex'
import HomeIndex from '../bundles/HomeIndex'
import CoinShow from '../bundles/CoinShow'

const AppRoutes = (props) => {
  return (
    <Switch>
      <Route exact={true} path="/" render={() => <HomeIndex {...props} />} />
      <Route
        exact={true}
        path="/news/:coinSlug?"
        render={(routeProps) => (
          <NewsfeedPageContainer
            loggedIn={!!props.user}
            coinSlug={routeProps.match.params.coinSlug}
            topCoinSlugs={props.topCoinSlugs}
            categories={props.categories}
            feedSources={props.feedSources}
            initialCoinWithDetails={props.initialCoinWithDetails}
          />
        )}
      />
      <Route
        exact={true}
        path="/news/:newsItemId/:newsItemSlug"
        render={(routeProps) => (
          <NewsfeedPageContainer
            loggedIn={!!props.user}
            newsItemId={routeProps.match.params.newsItemId}
            topCoinSlugs={props.topCoinSlugs}
            categories={props.categories}
            feedSources={props.feedSources}
            initialNewsItem={props.initialNewsItem}
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
    </Switch>
  )
}

export default AppRoutes
