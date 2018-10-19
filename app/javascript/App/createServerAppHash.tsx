import * as React from 'react'
import AppRoutes from '~/routes/AppRoutes'
import { StaticRouter, StaticRouterContext } from 'react-router'
import withAppProviders from '~/withAppProviders'
import * as _ from 'lodash'
import createServerComponentHash from '~/createServerComponentHash'
import { RailsConsumer } from '~/bundles/common/contexts/RailsContext'

const createServerAppRouter = (context) => {
  const ServerAppRouter = (props) => (
    <RailsConsumer>
      {({ location }) => (
        <StaticRouter location={location} context={context}>
          <AppRoutes {...props} />
        </StaticRouter>
      )}
    </RailsConsumer>
  )

  return ServerAppRouter
}

const createServerAppHash = (props, railsContext) => {
  // First create a context for `StaticRouter`, it's where we keep the
  // results of rendering for the second pass if necessary
  const context: StaticRouterContext = {}

  // Create a new combined `AppComponent` passing in `context` to be updated
  const AppComponent = withAppProviders(createServerAppRouter(context))
  // Render to component hash which includes the HTML and css
  const componentHash = createServerComponentHash(AppComponent)(
    props,
    railsContext,
  )

  // The mutated `context` will tell you if it redirected, if so, we ignore the generated markup and
  // send a redirect for Rails `react_component` to handle
  // see: https://github.com/shakacode/react_on_rails/blob/master/docs/additional-reading/react-router.md
  const redirected = !!context.url
  if (redirected) {
    return {
      redirectLocation: context.url,
    }
  }

  // Return the successful markup as a string for Rails `react_component` or `react_component_hash`
  // to handle
  // see: https://github.com/shakacode/react_on_rails#react_component_hash-for-generator-functions
  return componentHash
}

export default createServerAppHash
