import React, { Fragment } from 'react'
import Icon from '../Icon'
import SectionHeader from '../SectionHeader'
import SectionHeaderTight from '../SectionHeaderTight'
import SearchCoins from '../SearchCoins'
import FilterPanel from '../FilterPanel'
import bulbIcon from '../../images/bulbIcon.svg'
import filterBtn from '../../images/filter-btn.svg'

const CalendarListHeader = (props) => {
  const { enableUI, currentUI, coins, activeFilters, calendarTips } = props
  const toggleFilters = () =>
    enableUI('filterPanel', { fullScreen: window.isMobile })

  const btnStyle = {
    padding: '18px',
    borderRadius: 0,
  }

  return (
    <Fragment>
      {window.isMobile && (
        <SectionHeaderTight>
          <div className="flex-auto flex items-center">
            <Fragment>
              <button
                className="btn btn-blue btn-xs"
                onClick={() => enableUI('coinListDrawer', { fullScreen: true })}
                style={{
                  ...btnStyle,
                  ...{
                    background: '#2495ce',
                    flex: 1,
                    textTransform: 'none',
                    fontSize: 14,
                  },
                }}
              >
                <Icon name="list" className="mr2" />
                <span>Coins</span>
              </button>
              <button
                className="btn btn-blue btn-xs flex-auto"
                style={{
                  ...btnStyle,
                  ...{
                    flex: 1,
                    fontSize: 14,
                    textTransform: 'none',
                    padding: 19,
                  },
                }}
                onClick={calendarTips}
              >
                <img style={{ height: 10 }} src={bulbIcon} />
                <span style={{ marginLeft: 5 }}>Tips</span>
              </button>
            </Fragment>
          </div>
        </SectionHeaderTight>
      )}
      <SectionHeader>
        <div className="flex items-center flex-auto">
          {!window.isMobile && (
            <button
              className="btn btn-blue btn-xs coins-btn mr2"
              onClick={() => enableUI('coinListDrawer', { fullScreen: true })}
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
          <button
            onClick={toggleFilters}
            className="btn btn-xs btn-white filter-btn ml2 mr1"
          >
            <img style={{ height: 10, marginRight: 10 }} src={filterBtn} />
            Filters
          </button>
          <SearchCoins {...props} classProps="ml1 pl2 bl" />
        </div>
      </SectionHeader>
      {currentUI('filterPanel') && (
        <FilterPanel
          {...props}
          filterData={{ coins }}
          defaultFilters={{ events: props.defaultEvent }}
        />
      )}
    </Fragment>
  )
}

export default CalendarListHeader
