import React, { Fragment } from 'react'
import Icon from '../Icon'
import SectionHeader from '../SectionHeader'
import SectionHeaderTight from '../SectionHeaderTight'
import SearchCoins from '../SearchCoins'
import FilterPanel from '../FilterPanel'
import FilterTags from '../FilterTags'
import filterBtn from '../../images/filter-btn.svg'

const NewsListHeader = (props) => {
  const { coins, feedSources, showFilters, activeFilters, newsfeedTips } = props

  const toggleFilters = () => null
  //enableUI('filterPanel', { fullScreen: window.isMobile })

  const showCoinListDrawer = () => null

  const btnStyle = {
    padding: '16px',
    borderRadius: 0,
    display: 'inline-flex',
    textTransform: 'none',
  }

  return (
    <Fragment>
      {window.isMobile && (
        <SectionHeaderTight>
          <div className="flex-auto flex items-center">
            <button
              className="btn btn-blue btn-xs flex-auto justify-center"
              onClick={() => showCoinListDrawer()}
              style={{
                ...btnStyle,
                ...{
                  background: '#2495ce',
                },
              }}
            >
              <i class="material-icons f6 mr1">list</i>
              <span class="f6">Coins</span>
            </button>
            <button
              className="btn btn-blue btn-xs flex-auto justify-center"
              onClick={newsfeedTips}
              style={btnStyle}
            >
              <i class="material-icons f6 mr1">announcement</i>
              <span class="f6">Tips</span>
            </button>
          </div>
        </SectionHeaderTight>
      )}
      <SectionHeader>
        <div className="flex items-center flex-auto search-coin-wrapper">
          {!window.isMobile && (
            <button
              className="btn btn-blue btn-xs coins-btn mr2"
              onClick={() => showCoinListDrawer()}
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
          <SearchCoins {...props} />
          <button
            onClick={toggleFilters}
            className="btn btn-xs btn-white filter-btn ml2"
          >
            <img style={{ height: 10, marginRight: 10 }} src={filterBtn} />
            Filters
          </button>
        </div>
      </SectionHeader>
      {activeFilters &&
        activeFilters.size > 0 && (
          <div className="pa3 f6 b--b bg-athens flex items-center">
            <span className="mr2">Viewing by:</span>
            <FilterTags {...props} />
          </div>
        )}
      {showFilters && (
        <FilterPanel {...props} filterData={{ coins, feedSources }} />
      )}
    </Fragment>
  )
}

export default NewsListHeader
