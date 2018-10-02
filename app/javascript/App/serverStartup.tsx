import * as React from 'react'
import ReactOnRails from 'react-on-rails'

// react-router app
import createServerAppHash from './createServerAppHash'

// non-react-router components
import createServerComponentHash from './createServerComponentHash'
import CoinShow from './components/CoinShow'
import SignalExamplePanel from './bundles/signalsPage/SignalExamplePanel'
import SignalFaqPanel from './bundles/signalsPage/SignalFaqPanel'
import SignalPopoverText from './bundles/signalsPage/SignalPopoverText'
import SignalTeamMember from './bundles/signalsPage/SignalTeamMember'

// Register the components so they can be rendered from Rails
;(ReactOnRails as any).register({
  CoinShow: createServerComponentHash(CoinShow),
  SignalExamplePanel: createServerComponentHash(SignalExamplePanel),
  SignalFaqPanel: createServerComponentHash(SignalFaqPanel),
  SignalPopoverText: createServerComponentHash(SignalPopoverText),
  SignalTeamMember: createServerComponentHash(SignalTeamMember),
  App: createServerAppHash,
})
