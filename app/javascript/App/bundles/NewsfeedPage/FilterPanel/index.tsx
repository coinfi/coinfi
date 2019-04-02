import * as React from 'react'
import * as _ from 'lodash'
import Layout from './Layout'
import Dates from './filterComponents/Dates'
import FeedSources from './filterComponents/FeedSources'
import Social from './filterComponents/Social'
import Switch from './components/Switch'
import { Filters } from '../types'

import { getDefaultFilters } from '../utils'

interface Props {
  categories: string[]
  feedSources: string[]
  filters: Filters
  closeFilterPanel: () => void
  applyFilters: (filters: Filters) => void
  children?: any
  newsFeedStyle?: boolean
}

interface State {
  form: Filters
}

class FilterPanel extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      form: _.cloneDeep(this.props.filters),
    }
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

  public onCategoryToggle = (category: string) =>
    this.setState((state) => {
      if (state.form.categories.includes(category)) {
        state.form.categories = _.without(state.form.categories, category)
      } else {
        state.form.categories.push(category)
      }
      return state
    })

  public onFeedSourceToggle = (source: string) =>
    this.setState((state) => {
      if (state.form.feedSources.includes(source)) {
        state.form.feedSources = _.without(state.form.feedSources, source)
      } else {
        state.form.feedSources.push(source)
      }
      return state
    })

  public onTrendingToggle = () =>
    this.setState((state) => {
      state.form.trending = !state.form.trending
      return state
    })

  public render() {
    return (
      <Layout
        closeFilterPanel={this.onClosePanel}
        resetFilters={this.onReset}
        applyFilters={this.applyFilters}
        newsFeedStyle={this.props.newsFeedStyle}
      >
        <div className="pb3">
          <div className="pv2">
            <span className="mr2">Only show me Trending News</span>
            <Switch
              on={this.state.form.trending}
              onChange={this.onTrendingToggle}
            />
          </div>
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
