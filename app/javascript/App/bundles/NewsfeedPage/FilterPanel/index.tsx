import * as React from 'react'
import _ from 'lodash'
import Layout from './Layout'
import MarketMoving from './filterComponents/MarketMoving'
import Coins from './filterComponents/Coins'
import Dates from './filterComponents/Dates'
import FeedSources from './filterComponents/FeedSources'
import Social from './filterComponents/Social'
import Categories from './filterComponents/Categories'
import { IFilters } from '../types'

import getDefaultFilters from '../defaultFilters'

interface IProps {
  isShown: boolean
  categories: string[]
  feedSources: string[]
  filters: IFilters
  closeFilterPanel: () => void
  applyFilters: (filters: IFilters) => void
  children?: any
  newsFeedStyle?: boolean
}

interface IState {
  form: IFilters
}

class FilterPanel extends React.Component<IProps, IState> {
  public static state = {
    form: getDefaultFilters(),
  }

  constructor(props) {
    super(props)
    this.state = { form: _.cloneDeep(this.props.filters) }
  }

  public applyFilters = () => {
    this.props.applyFilters(this.state.form)
    this.props.closeFilterPanel()
  }

  public onClosePanel = () => {
    this.setState({
      form: _.cloneDeep(this.props.filters),
    })
    this.props.closeFilterPanel()
  }

  public onReset = () => {
    this.setState({ form: getDefaultFilters() })
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

  public onCagetoryToggle = (category: string) =>
    this.setState((state) => {
      if (state.form.categories.includes(category)) {
        state.form.categories = state.form.categories.filter(
          (cat) => cat !== category,
        )
      } else {
        state.form.categories.push(category)
      }
      return state
    })

  public onFeedSourceToggle = (source: string) =>
    this.setState((state) => {
      if (state.form.feedSources.includes(source)) {
        state.form.feedSources = state.form.feedSources.filter(
          (src) => src !== source,
        )
      } else {
        state.form.feedSources.push(source)
      }
      return state
    })

  public render() {
    if (!this.props.isShown) {
      return null
    }

    return (
      <Layout
        closeFilterPanel={this.onClosePanel}
        resetFilters={this.onReset}
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
          <Categories
            items={this.props.categories}
            selectedItems={this.state.form.categories}
            onChange={this.onCagetoryToggle}
          />
        </div>
        <div className="pb3">
          <h4 className="mb2 f5">Social Sources</h4>
          <Social
            feedSources={this.state.form.feedSources}
            onToggleReddit={() => this.onFeedSourceToggle('reddit')}
            onToggleTwitter={() => this.onFeedSourceToggle('twitter')}
          />
        </div>
        <div className="pb3">
          <h4 className="mb2 f5">General sources</h4>
          <FeedSources
            feedSources={this.props.feedSources}
            selectedItems={this.state.form.feedSources}
            onChange={this.onFeedSourceToggle}
          />
        </div>
      </Layout>
    )
  }
}

export default FilterPanel
