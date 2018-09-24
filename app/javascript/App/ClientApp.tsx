import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AppRoutes from '~/routes/AppRoutes'
import withCombinedProviders from './withCombinedProviders'

const ClientAppRouter = (props, railsContext) => (
  <Router>
    <AppRoutes {...props} />
  </Router>
)

const ClientApp = withCombinedProviders(ClientAppRouter)

export default ClientApp
