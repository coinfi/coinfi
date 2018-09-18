import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import CoinListContainer from './bundles/common/containers/CoinListContainer'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import configureStore from './configureStore'
import appContainer from './containers/app'

interface Props {
  user: any
}

interface State {
  store: any
  persistor: any
}

const withStore = (Component) => {
  return class extends React.Component<Props, State> {
    private ComponentInAppContainer = null
    public constructor(props) {
      super(props)

      const { store, persistor } = configureStore()
      this.state = {
        store,
        persistor,
      }
      this.ComponentInAppContainer = appContainer(Component)
    }

    public render() {
      const { ComponentInAppContainer } = this
      return (
        <MuiThemeProvider theme={theme}>
          <CoinListContainer loggedIn={!!this.props.user}>
            <Provider store={this.state.store}>
              <PersistGate loading={null} persistor={this.state.persistor}>
                <ComponentInAppContainer {...this.props} />
              </PersistGate>
            </Provider>
          </CoinListContainer>
        </MuiThemeProvider>
      )
    }
  }
}

export default withStore
