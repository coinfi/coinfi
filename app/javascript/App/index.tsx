import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '~/theme'

import ExchangeListingsPage from '~/bundles/ExchangeListings/ExchangeListingsCointainer'
import NewsfeedPageNew from '~/bundles/NewsfeedPage/NewsfeedPageContainer'
import CoinIndex from './components/CoinIndex'
import CoinListContainer from '~/bundles/common/containers/CoinListContainer'
import NewsfeedContainer from '~/bundles/NewsfeedPage/NewsfeedContainer'
import { DeviceProvider } from '~/bundles/common/contexts/DeviceContext'
import { RailsProvider } from '~/bundles/common/contexts/RailsContext'

const App = (props, railsContext) => (
  <RailsProvider railsContext={railsContext}>
    <MuiThemeProvider theme={theme}>
      <DeviceProvider {...railsContext.deviceProviderProps}>
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
                      topCoinSlugs={props.topCoinSlugs}
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
                      topCoinSlugs={props.topCoinSlugs}
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
      </DeviceProvider>
    </MuiThemeProvider>
  </RailsProvider>
)

export default App
