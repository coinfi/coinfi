import ReactOnRails from 'react-on-rails'

// react-router app
import ServerApp from './ServerApp'

// non-react-router components
import NavUserContainer from './bundles/common/containers/NavUserContainer'
import CoinShow from './components/CoinShow'
import IcoFilters from './components/IcoFilters'
import FlashMessageListContainer from './bundles/common/containers/FlashMessageListContainer'
import WatchButton from './bundles/common/components/WatchButton'
import CalendarPage from './components/CalendarPage'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  NavUserContainer,
  CoinShow,
  IcoFilters,
  FlashMessageListContainer,
  WatchButton,
  CalendarPage,
  App: ServerApp,
})
