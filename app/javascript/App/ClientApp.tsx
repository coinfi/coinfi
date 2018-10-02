import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '~/routes/AppRoutes'
import withCombinedProviders from './withCombinedProviders'
import { MuiThemeProvider } from '@material-ui/core'
import theme from '~/theme'

const createClientAppRouter = (railsContext) => {
  const ClientAppRouter = (props) => (
    <Router>
      <AppRoutes {...props} />
    </Router>
  )

  return ClientAppRouter
}

const ClientApp = (props, railsContext) => (
  <MuiThemeProvider theme={theme}>
    {withCombinedProviders(createClientAppRouter(railsContext))(
      props,
      railsContext,
    )}
  </MuiThemeProvider>
)

export default ClientApp
