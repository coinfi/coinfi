import React from 'react'
import SectionHeader from './SectionHeader'
import CoinListSearch from './CoinListSearch'
import Switch from '../Switch'
import Icon from '../Icon'

const CoinListHeader = (props) => {
  const { toggleUI, currentUI } = props
  return (
    <SectionHeader>
      <div className="pv1">
        {currentUI('coinSearch') ? (
          <CoinListSearch {...props} />
        ) : (
          <div className="flex items-center">
            <Switch
              on={currentUI('watchingOnly')}
              onChange={() => toggleUI('watchingOnly')}
            />
            <span className="ml2 f6 silver">Watching only</span>
          </div>
        )}
      </div>
      <div className="pv1">
        {currentUI('coinSearch') ? (
          <Icon onClick={() => toggleUI('coinSearch')} name="times" regular />
        ) : (
          <span className="tooltipped">
            <Icon onClick={() => toggleUI('coinSearch')} name="plus" regular />
            <span className="tooltip">Add a coin</span>
          </span>
        )}
      </div>
    </SectionHeader>
  )
}

export default CoinListHeader
