import * as React from 'react'
import * as _ from 'lodash'
import Icon from '../../components/Icon'
import SectionHeader from '../../components/SectionHeader'
import CoinTipsTab from '../common/components/CoinTipsTab'
import FilterPanel from './FilterPanel'
import CoinSelector, {
  CoinOption,
} from '~/bundles/common/components/CoinSelector'
import { Filters } from './types'
import withDevice from '~/bundles/common/utils/withDevice'

// tslint:disable-next-line
const filterBtn = require('../../images/filter-btn.svg')

interface Props {
  showFilters: boolean
  categories: string[]
  feedSources: string[]
  topCoinSlugs: string[]
  filters: Filters
  applyFilters: (filters: Filters) => void
  toggleFilters: () => void
  toggleNewsfeedTips: () => void
  showCoinListDrawer?: () => void
  onCoinChange: (selectedOption: CoinOption) => void
  selectedCoin: string
  isMobile: boolean
}

const btnStyle: React.CSSProperties = {
  borderRadius: 0,
  display: 'inline-flex',
  padding: '16px',
  textTransform: 'none',
}

const searchStyle: React.CSSProperties = {
  flex: '1 1 auto',
  marginLeft: '1em',
  minWidth: '160px',
  maxWidth: '300px',
}

class NewsListHeader extends React.Component<Props, {}> {
  public render() {
    return (
      <>
        {this.props.isMobile && (
          <CoinTipsTab
            showCoinListDrawer={this.props.showCoinListDrawer}
            showTips={this.props.toggleNewsfeedTips}
          />
        )}
        <SectionHeader>
          <div
            id="panel-header"
            className="flex items-center flex-auto search-coin-wrapper"
          >
            {!this.props.isMobile && (
              <button
                className="btn btn-blue btn-xs coins-btn mr2"
                onClick={() =>
                  !!this.props.showCoinListDrawer &&
                  this.props.showCoinListDrawer()
                }
                style={
                  this.props.isMobile
                    ? {
                        ...btnStyle,
                        ...{
                          background: '#2495ce',
                          flex: 1,
                          textTransform: 'none',
                        },
                      }
                    : {}
                }
              >
                <Icon name="list" className="mr2" />
                <span>Coins</span>
              </button>
            )}
            <button
              onClick={this.props.toggleFilters}
              className="btn btn-xs btn-white filter-btn ml2"
            >
              <img style={{ height: 10, marginRight: 10 }} src={filterBtn} />
              Filters
            </button>
            <div style={searchStyle}>
              <CoinSelector
                selectedCoin={this.props.selectedCoin}
                onChange={this.props.onCoinChange}
                placeholder="Search Coins"
              />
            </div>
          </div>
        </SectionHeader>
        {this.props.showFilters && (
          <FilterPanel
            categories={this.props.categories}
            feedSources={this.props.feedSources}
            filters={this.props.filters}
            closeFilterPanel={this.props.toggleFilters}
            applyFilters={this.props.applyFilters}
            newsFeedStyle={true}
          />
        )}
      </>
    )
  }
}

export default withDevice(NewsListHeader)
