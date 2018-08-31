import * as React from 'react'
import _ from 'lodash'
import Switch from '../components/Switch'

const RedditLogo = require('../../../../images/logo-reddit.svg')
const TwitterLogo = require('../../../../images/logo-twitter.svg')

const Block = (props) => (
  <div className="pv2">
    <span className="mr2">
      <img src={props.logo} className="mr2 v-top" />
      {props.label}
    </span>
    {props.children}
  </div>
)

interface IProps {
  feedSources: string[]
  onToggleReddit: () => void
  onToggleTwitter: () => void
}

const Social = (props: IProps) => (
  <>
    <div className="pv2 f6">
      Reddit and Twitter often has more noise than signal so we&apos;ve disabled
      them by default, but you can enable them here.
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
