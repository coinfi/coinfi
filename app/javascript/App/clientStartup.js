import ReactOnRails from 'react-on-rails'
import withClientProviders from '~/withClientProviders'

// react-router app
import ClientApp from './ClientApp'

// non-react-router components
import NavUserContainer from './bundles/common/containers/NavUserContainer'
import CoinShow from './components/CoinShow'
import IcoFilters from './components/IcoFilters'
import FlashMessageListContainer from './bundles/common/containers/FlashMessageListContainer'
import WatchButton from './bundles/common/components/WatchButton'
import CalendarPage from './components/CalendarPage'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  NavUserContainer: withClientProviders(NavUserContainer),
  CoinShow: withClientProviders(CoinShow),
  IcoFilters: withClientProviders(IcoFilters),
  FlashMessageListContainer: withClientProviders(FlashMessageListContainer),
  WatchButton: withClientProviders(WatchButton),
  CalendarPage: withClientProviders(CalendarPage),
  App: ClientApp,
})
