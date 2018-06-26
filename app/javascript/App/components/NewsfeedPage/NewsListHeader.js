import React, { Fragment } from 'react'
import Icon from '../Icon'
import SectionHeader from './SectionHeader'
import SectionHeaderTight from './SectionHeaderTight'
import SearchCoins from './SearchCoins'
import FilterPanel from '../FilterPanel'
import FilterTags from '../FilterTags'
import bulbIcon from '../../images/bulbIcon.svg'

const NewsListHeader = (props) => {
  const { enableUI, currentUI, coins, feedSources, activeFilters, activeEntity, newsfeedTips } = props
  const toggleFilters = () =>
    enableUI('filterPanel', { fullScreen: window.isMobile })

  const btnStyle = {
    padding: '18px',
    borderRadius: 0
  }

  return (
    <Fragment>
      {window.isMobile && (
          <SectionHeaderTight>
          <div className="flex-auto flex items-center">
          {!window.isDesktop && (
            <Fragment>
            <button
            className="btn btn-blue btn-xs"
            onClick={() => enableUI('coinListDrawer', { fullScreen: true })}
            style={{...btnStyle, ...{background: '#2495ce', flex: 1}}}
            >
            <Icon name="list" className="mr2" />
            <span>Coin list</span>
            </button>
            <button
              className="btn btn-blue btn-xs flex-auto"
              style={{...btnStyle, ...{flex: 1}}}
              onClick={newsfeedTips}
            >
              <img style={{height:10}} src={bulbIcon} />
              <span style={{marginLeft:5}}>Tips</span>
            </button>
            </Fragment>
          )}
          </div>
          </SectionHeaderTight>
        )
      }
      <SectionHeader>
        <div className="flex items-center">
          {!window.isMobile && (
            <button
              className="btn btn-blue btn-xs"
              onClick={() => enableUI('coinListDrawer', { fullScreen: true })}
              style={window.isMobile ? {...btnStyle, ...{background: '#2495ce', flex: 1}} : {}}
            >
              <Icon name="list" className="mr2" />
              <span>Coin list</span>
            </button>
          )}
          <SearchCoins {...props} />
          <button onClick={toggleFilters} className="btn btn-xs btn-white"
            style={{ marginLeft: 90,
              width: 200,
              textTransform: 'none',
              fontSize: 14
            }}
          >
            <Icon name="filter" className="mr2" />
            Filters
          </button>
        </div>
      </SectionHeader>
      {activeFilters.size > 0 && (
        <div className="pa3 b--b bg-athens">
          <div className="f6 mb2">Currently viewing by:</div>
          <FilterTags {...props} />
        </div>
      )}
      {currentUI('filterPanel') && (
        <FilterPanel {...props} filterData={{ coins, feedSources }} />
      )}
    </Fragment>
  )
}

export default NewsListHeader
