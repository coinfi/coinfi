import * as React from 'react'
import ReactOnRails from 'react-on-rails'
import createServerComponentHash from './createServerComponentHash'

// react-router app
import createServerAppHash from './createServerAppHash'

// non-react-router components
import NavUserContainer from './bundles/common/containers/NavUserContainer'
import CoinShow from './bundles/CoinShow'
import FlashMessageListContainer from './bundles/common/containers/FlashMessageListContainer'
import WatchStar from './bundles/common/components/WatchStar'
import SignalExamplePanel from './bundles/signalsPage/SignalExamplePanel'
import SignalFaqPanel from './bundles/signalsPage/SignalFaqPanel'
import SignalPopoverText from './bundles/signalsPage/SignalPopoverText'
import SignalTeamMember from './bundles/signalsPage/SignalTeamMember'
import SignalReservationForm from './bundles/signalsPage/SignalReservationForm'

// Register the components so they can be rendered from Rails
;(ReactOnRails as any).register({
  NavUserContainer: createServerComponentHash(NavUserContainer, true),
  CoinShow: createServerComponentHash(CoinShow, true),
  FlashMessageListContainer: createServerComponentHash(
    FlashMessageListContainer,
    true,
  ),
  WatchStar: createServerComponentHash(WatchStar, true),
  SignalExamplePanel: createServerComponentHash(SignalExamplePanel),
  SignalFaqPanel: createServerComponentHash(SignalFaqPanel),
  SignalPopoverText: createServerComponentHash(SignalPopoverText),
  SignalTeamMember: createServerComponentHash(SignalTeamMember),
  SignalReservationForm: createServerComponentHash(SignalReservationForm),
  App: createServerAppHash,
})
