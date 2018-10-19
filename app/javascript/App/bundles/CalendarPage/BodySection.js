import React from 'react'
import CalendarBody from './CalendarBody'
import CoinBody from '~/bundles/common/components/CoinBody'
import Tips from './Tips'

// TODO: Refactor this to be on the same level as BodySectionDrawer and CoinBody if possible
const BodySection = (props) => {
  const { activeEntity } = props
  if (!activeEntity) return <Tips {...props} />
  if (activeEntity.type === 'coin') return <CoinBody {...props} />
  return <CalendarBody {...props} />
}

export default BodySection
