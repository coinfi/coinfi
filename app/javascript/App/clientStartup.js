import ReactOnRails from 'react-on-rails'
import withClientProviders from '~/withClientProviders'

// react-router app
import ClientApp from './ClientApp'

// non-react-router components
import NavUserContainer from './bundles/common/containers/NavUserContainer'
import CoinShow from './bundles/CoinShow'
import FlashMessageListContainer from './bundles/common/containers/FlashMessageListContainer'
import WatchButton from './bundles/common/components/WatchButton'
import CalendarPage from './bundles/CalendarPage'
import SignalExamplePanel from './bundles/signalsPage/SignalExamplePanel'
import SignalFaqPanel from './bundles/signalsPage/SignalFaqPanel'
import SignalPopoverText from './bundles/signalsPage/SignalPopoverText'
import SignalTeamMember from './bundles/signalsPage/SignalTeamMember'
import SignalReservationForm from './bundles/signalsPage/SignalReservationForm'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  NavUserContainer: withClientProviders(NavUserContainer, { clientOnly: true }),
  CoinShow: withClientProviders(CoinShow),
  FlashMessageListContainer: withClientProviders(FlashMessageListContainer, {
    clientOnly: true,
  }),
  WatchButton: withClientProviders(WatchButton, { clientOnly: true }),
  CalendarPage: withClientProviders(CalendarPage, { clientOnly: true }),
  SignalExamplePanel: withClientProviders(SignalExamplePanel),
  SignalFaqPanel: withClientProviders(SignalFaqPanel),
  SignalPopoverText: withClientProviders(SignalPopoverText),
  SignalTeamMember: withClientProviders(SignalTeamMember),
  SignalReservationForm: withClientProviders(SignalReservationForm),
  App: ClientApp,
})
