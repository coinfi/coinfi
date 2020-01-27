import ReactOnRails from 'react-on-rails'
import withRootProviders from '~/withRootProviders'

// react-router app
import ClientApp from './ClientApp'

// non-react-router components
import NavUserContainer from './bundles/common/containers/NavUserContainer'
import FlashMessageListContainer from './bundles/common/containers/FlashMessageListContainer'
import WatchStar from './bundles/common/components/WatchStar'
import SignalExamplePanel from './bundles/signalsPage/SignalExamplePanel'
import SignalFaqPanel from './bundles/signalsPage/SignalFaqPanel'
import SignalPopoverText from './bundles/signalsPage/SignalPopoverText'
import SignalTeamMember from './bundles/signalsPage/SignalTeamMember'
import SignalReservationForm from './bundles/signalsPage/SignalReservationForm'
import CurrencySelectorWidget from './bundles/CurrencySelectorWidget'
import DarkModeContainer from './bundles/common/containers/DarkModeContainer'
import MarkdownPreview from './bundles/common/containers/MarkdownPreview'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  NavUserContainer: withRootProviders(NavUserContainer),
  FlashMessageListContainer: withRootProviders(FlashMessageListContainer),
  WatchStar: withRootProviders(WatchStar),
  SignalExamplePanel: withRootProviders(SignalExamplePanel),
  SignalFaqPanel: withRootProviders(SignalFaqPanel),
  SignalPopoverText: withRootProviders(SignalPopoverText),
  SignalTeamMember: withRootProviders(SignalTeamMember),
  SignalReservationForm: withRootProviders(SignalReservationForm),
  CurrencySelectorWidget: withRootProviders(CurrencySelectorWidget),
  DarkModeContainer: withRootProviders(DarkModeContainer),
  MarkdownPreview: withRootProviders(MarkdownPreview),
  App: ClientApp,
})
