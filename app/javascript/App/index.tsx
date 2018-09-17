import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '~/theme'

import ExchangeListingsPage from '~/bundles/ExchangeListings/ExchangeListingsCointainer'
import NewsfeedPageNew from '~/bundles/NewsfeedPage/NewsfeedPageContainer'
import CoinIndex from './components/CoinIndex'
import CoinListContainer from '~/bundles/common/containers/CoinListContainer'
import NewsfeedContainer from '~/bundles/NewsfeedPage/NewsfeedContainer'

const App = (props, railsContext) => (
  <MuiThemeProvider theme={theme}>
    <NewsfeedContainer>
      <CoinListContainer loggedIn={!!props.user}>
        <Router>
          <Switch>
            <Route
              exact={true}
              path="/news/:coinSlug?"
              render={(routeProps) => (
                <NewsfeedPageNew
                  loggedIn={!!props.user}
                  coinSlug={routeProps.match.params.coinSlug}
                  categories={props.categories}
                  feedSources={props.feedSources}
                />
              )}
            />
            <Route
              exact={true}
              path="/news/:newsItemId/:newsItemSlug"
              render={(routeProps) => (
                <NewsfeedPageNew
                  loggedIn={!!props.user}
                  newsItemId={routeProps.match.params.newsItemId}
                  categories={props.categories}
                  feedSources={props.feedSources}
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
          </Switch>
        </Router>
      </CoinListContainer>
    </NewsfeedContainer>
  </MuiThemeProvider>
)

export default App
