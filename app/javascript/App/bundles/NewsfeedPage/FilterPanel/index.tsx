import * as React from 'react'
import Layout from './Layout'
import { normalizeFilterData } from '../../../lib/stateHelpers'
import MarketMoving from './filterComponents/MarketMoving'
import Coins from './filterComponents/Coins'
import Dates from './filterComponents/Dates'
import FeedSources from './filterComponents/FeedSources'
import Categories from './filterComponents/Categories'
import Keywords from './filterComponents/Keywords'

interface IProps {
  closeFilterPanel: () => void
  resetFilters: () => void
  applyFilters: () => void
  children: React.ReactChildren
  newsFeedStyle?: boolean
}

class FilterPanel extends React.Component<IProps, {}> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <Layout
        closeFilterPanel={this.props.closeFilterPanel}
        resetFilters={this.props.resetFilters}
        applyFilters={this.props.applyFilters}
        newsFeedStyle={true}
      >
        <div className="pb3">
          <h4 className="mb2 f5">Market moving</h4>
          <MarketMoving />
        </div>
        <div className="pb3">
          <h4 className="mb2 f5">Dates</h4>
          <Dates />
        </div>
        <div className="pb3">
          <h4 className="mb2 f5">Categories</h4>
          <Categories />
        </div>
        <div className="pb3">
          <h4 className="mb2 f5">Social Sources</h4>
          <SocialSources />
        </div>
        <div className="pb3">
          <h4 className="mb2 f5">General sources</h4>
          <FeedSources />
        </div>
      </Layout>
    )
  }
}

export default FilterPanel
