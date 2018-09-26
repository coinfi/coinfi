import * as React from 'react'
import AppRoutes from '~/routes/AppRoutes'
import { renderToString } from 'react-dom/server'
import { StaticRouter, StaticRouterContext } from 'react-router'
import withCombinedProviders from './withCombinedProviders'
import * as _ from 'lodash'
import { SheetsRegistry } from 'jss'
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core'
import JssProvider from 'react-jss/lib/JssProvider'
import theme from './theme'
import createServerComponentHash from '~/createServerComponentHash'

const createServerAppRouter = (railsContext, context) => {
  const ServerAppRouter = (props) => (
    <StaticRouter location={railsContext.location} context={context}>
      <AppRoutes {...props} />
    </StaticRouter>
  )

  return ServerAppRouter
}

const createServerAppHash = (props, railsContext) => {
  // First create a context for `StaticRouter`, it's where we keep the
  // results of rendering for the second pass if necessary
  const context: StaticRouterContext = {}

  // Create a new combined `AppComponent` passing in `context` to be updated
  const AppComponent = withCombinedProviders(
    createServerAppRouter(railsContext, context),
  )
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
