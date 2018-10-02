import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AppRoutes from '~/routes/AppRoutes'
import withAppProviders from '~/withAppProviders'
import withClientProviders from '~/withClientProviders'

const createClientAppRouter = () => {
  const ClientAppRouter = (props) => (
    <Router>
      <AppRoutes {...props} />
    </Router>
  )

  return ClientAppRouter
}

const ClientApp = withClientProviders(withAppProviders(createClientAppRouter()))

export default ClientApp
