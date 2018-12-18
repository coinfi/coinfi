import * as React from 'react'
import ReactOnRails from 'react-on-rails'

// react-router app
import createServerAppHash from './createServerAppHash'

// non-react-router components
import createServerComponentHash from './createServerComponentHash'
import SignalExamplePanel from './bundles/signalsPage/SignalExamplePanel'
import SignalFaqPanel from './bundles/signalsPage/SignalFaqPanel'
import SignalPopoverText from './bundles/signalsPage/SignalPopoverText'
import SignalTeamMember from './bundles/signalsPage/SignalTeamMember'
import SignalReservationForm from './bundles/signalsPage/SignalReservationForm'
import CurrencySelectorWidget from './bundles/CurrencySelectorWidget'

// Register the components so they can be rendered from Rails
;(ReactOnRails as any).register({
  SignalExamplePanel: createServerComponentHash(SignalExamplePanel),
  SignalFaqPanel: createServerComponentHash(SignalFaqPanel),
  SignalPopoverText: createServerComponentHash(SignalPopoverText),
  SignalTeamMember: createServerComponentHash(SignalTeamMember),
  SignalReservationForm: createServerComponentHash(SignalReservationForm),
  CurrencySelectorWidget: createServerComponentHash(CurrencySelectorWidget),
  App: createServerAppHash,
})
