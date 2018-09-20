import ReactOnRails from 'react-on-rails'

// react-router app
import ServerApp from './ServerApp'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  App: ServerApp,
})
