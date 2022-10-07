import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
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
            user={props.user}
            loggedIn={!!props.user}
            coinSlug={routeProps.match.params.coinSlug}
            topCoinSlugs={props.topCoinSlugs}
            categories={props.categories}
            feedSources={props.feedSources}
            initialDrawer={props.initialDrawer}
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
            initialDrawer={props.initialDrawer}
            initialNewsItem={props.initialNewsItem}
            initialTheme={props.initialTheme}
          />
        )}
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
