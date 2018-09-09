declare var window: {
  isMobile?: boolean
}

import * as React from 'react'
import Icon from '../../components/Icon'
import SectionHeader from '../../components/SectionHeader'
import SectionHeaderTight from '../../components/SectionHeaderTight'
import SearchCoins from '../../components/SearchCoins'
import CoinTipsTab from '../common/components/CoinTipsTab'
import FilterPanel from './FilterPanel'
import { IFilters } from './types'

// tslint:disable-next-line
const filterBtn = require('../../images/filter-btn.svg')

interface IProps {
  showFilters: boolean
  categories: string[]
  feedSources: string[]
  filters: IFilters
  applyFilters: (filters: IFilters) => void
  toggleFilters: () => void
  toggleNewsfeedTips: () => void
  showCoinListDrawer: () => void
}

const btnStyle: React.CSSProperties = {
  borderRadius: 0,
  display: 'inline-flex',
  padding: '16px',
  textTransform: 'none',
}

export default class NewsListHeader extends React.Component<IProps, {}> {
  public render() {
    return (
      <>
        {window.isMobile && (
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
            {!window.isMobile && (
              <button
                className="btn btn-blue btn-xs coins-btn mr2"
                onClick={() => this.props.showCoinListDrawer()}
                style={
                  window.isMobile
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
            {/* <SearchCoins {...props} /> */}
            <button
              onClick={this.props.toggleFilters}
              className="btn btn-xs btn-white filter-btn ml2"
            >
              <img style={{ height: 10, marginRight: 10 }} src={filterBtn} />
              Filters
            </button>
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
