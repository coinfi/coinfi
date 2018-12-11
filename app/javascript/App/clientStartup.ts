import ReactOnRails from 'react-on-rails'
import withRootProviders from '~/withRootProviders'

// react-router app
import ClientApp from './ClientApp'

// non-react-router components
import SignalExamplePanel from './bundles/signalsPage/SignalExamplePanel'
import SignalFaqPanel from './bundles/signalsPage/SignalFaqPanel'
import SignalPopoverText from './bundles/signalsPage/SignalPopoverText'
import SignalTeamMember from './bundles/signalsPage/SignalTeamMember'
import SignalReservationForm from './bundles/signalsPage/SignalReservationForm'

// Register the components so they can be rendered from Rails
ReactOnRails.register({
  SignalExamplePanel: withRootProviders(SignalExamplePanel),
  SignalFaqPanel: withRootProviders(SignalFaqPanel),
  SignalPopoverText: withRootProviders(SignalPopoverText),
  SignalTeamMember: withRootProviders(SignalTeamMember),
  SignalReservationForm: withRootProviders(SignalReservationForm),
  App: ClientApp,
})
