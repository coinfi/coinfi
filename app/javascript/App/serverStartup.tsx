import * as React from 'react'
import ReactOnRails from 'react-on-rails'

// react-router app
import createServerAppHash from './createServerAppHash'

// non-react-router components
import createServerComponentHash from './createServerComponentHash'
import CoinShow from './components/CoinShow'

// Register the components so they can be rendered from Rails
;(ReactOnRails as any).register({
  CoinShow: createServerComponentHash((props) => <CoinShow {...props} />),
  App: createServerAppHash,
})
