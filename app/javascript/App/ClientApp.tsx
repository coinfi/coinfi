import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '~/routes/AppRoutes'
import withAppProviders from '~/withAppProviders'
import withRootProviders from '~/withRootProviders'

const createClientAppRouter = () => {
  const ClientAppRouter = (props) => (
    <Router>
      <AppRoutes {...props} />
    </Router>
  )

  return ClientAppRouter
}

const ClientApp = withRootProviders(withAppProviders(createClientAppRouter()))

export default ClientApp
