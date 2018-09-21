import ReactOnRails from 'react-on-rails'

// react-router app
import ServerApp from './ServerApp'

// non-react-router components
import CoinShow from './components/CoinShow'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  CoinShow,
  App: ServerApp,
})
