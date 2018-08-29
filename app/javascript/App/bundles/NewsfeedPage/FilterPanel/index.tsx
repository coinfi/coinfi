import * as React from 'react'
import Layout from './Layout'
import { normalizeFilterData } from '../../../lib/stateHelpers'
import MarketMoving from './filterComponents/MarketMoving'
import Coins from './filterComponents/Coins'
import Dates from './filterComponents/Dates'
import FeedSources from './filterComponents/FeedSources'
import Categories from './filterComponents/Categories'
import Keywords from './filterComponents/Keywords'
import { IFilters } from '../types'

interface IProps {
  filters: IFilters
  closeFilterPanel: () => void
  resetFilters: () => void
  applyFilters: (filters: IFilters) => void
  children?: any
  newsFeedStyle?: boolean
}

interface IState {
  form: IFilters
}

class FilterPanel extends React.Component<IProps, IState> {
  public static state = {
    form: {
      coinSlugs: [],
      publishedSince: null,
      publishedUntil: null,
    },
  }

  constructor(props) {
    super(props)
    this.state = { form: this.props.filters }
  }

  public componentDidUpdate(prevProps, prevState) {
    // TODO
  }

  public applyFilters = () => {
    this.props.applyFilters(this.state.form)
    this.props.closeFilterPanel()
  }

  public onSinceChange = (publishedSince: string) =>
    this.setState((state) => {
      state.form.publishedSince = publishedSince
      return state
    })

  public onUntilChange = (publishedUntil: string) =>
    this.setState((state) => {
      state.form.publishedUntil = publishedUntil
      return state
    })

  public render() {
    return (
      <Layout
        closeFilterPanel={this.props.closeFilterPanel}
        resetFilters={this.props.resetFilters}
        applyFilters={this.applyFilters}
        newsFeedStyle={this.props.newsFeedStyle}
      >
        <div className="pb3">
          <h4 className="mb2 f5">Market Moving</h4>
          <MarketMoving />
        </div>
        <div className="pb3">
          <h4 className="mb2 f5">Date Range</h4>
          <Dates
            publishedSince={this.state.form.publishedSince}
            publishedUntil={this.state.form.publishedUntil}
            onSinceChange={this.onSinceChange}
            onUntilChange={this.onUntilChange}
          />
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
