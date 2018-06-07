import React from 'react'
import SectionHeader from './SectionHeader'
import Switch from '../Switch'

const CoinListHeader = (props) => {
  const { toggleUI, currentUI } = props
  return (
    <SectionHeader>
      <div className="flex items-center">
        <Switch
          on={currentUI(['newsfeed', 'watchingOnly'])}
          onChange={() => toggleUI(['newsfeed', 'watchingOnly'])}
        />
        <span className="ml2 f6 silver">Watching only</span>
      </div>
      <div />
    </SectionHeader>
  )
}

export default CoinListHeader
