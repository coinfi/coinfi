import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './configureStore'
import { Store } from 'redux'
import { Persistor } from 'redux-persist'

interface State {
  store: Store<any>
  persistor: Persistor
}

const withReduxStore = (TargetComponent) => {
  return class extends React.Component<any, State> {
    public constructor(props) {
      super(props)

      const { store, persistor } = configureStore()
      this.state = {
        store,
        persistor,
      }
    }

    public render() {
      return (
        <Provider store={this.state.store}>
          <PersistGate loading={null} persistor={this.state.persistor}>
            <TargetComponent {...this.props} />
          </PersistGate>
        </Provider>
      )
    }
  }
}

export default withReduxStore
