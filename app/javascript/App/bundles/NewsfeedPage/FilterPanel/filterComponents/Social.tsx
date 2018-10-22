import * as React from 'react'
import * as _ from 'lodash'
import Switch from '../components/Switch'
const RedditLogo = require('~/images/logoReddit.svg')
const TwitterLogo = require('~/images/logoTwitter.svg')

const Block = (props) => (
  <div className="pv2">
    <span className="mr2">
      <img src={props.logo} className="mr2 v-top" />
      {props.label}
    </span>
    {props.children}
  </div>
)

interface Props {
  feedSources: string[]
  onToggleReddit: () => void
  onToggleTwitter: () => void
}

const Social = (props: Props) => (
  <>
    <div className="pv2 f6">
      {`If a coin does not have a lot of news coverage from our general sources, we'll automatically enable social sources for the coin.`}
    </div>
    <Block label="Reddit" logo={RedditLogo}>
      <Switch
        on={props.feedSources.includes('reddit')}
        onChange={props.onToggleReddit}
      />
    </Block>
    <Block label="Twitter" logo={TwitterLogo}>
      <Switch
        on={props.feedSources.includes('twitter')}
        onChange={props.onToggleTwitter}
      />
    </Block>
  </>
)

export default Social
