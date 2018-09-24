import ReactOnRails from 'react-on-rails'

// react-router app
import ServerApp from './ServerApp'

// non-react-router components
import CoinShow from './components/CoinShow'
import SignalExamplePanel from './bundles/signalsPage/SignalExamplePanel'
import SignalFaqPanel from './bundles/signalsPage/SignalFaqPanel'
import SignalPopoverText from './bundles/signalsPage/SignalPopoverText'
import SignalTeamMember from './bundles/signalsPage/SignalTeamMember'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  CoinShow,
  SignalExamplePanel,
  SignalFaqPanel,
  SignalPopoverText,
  SignalTeamMember,
  App: ServerApp,
})
