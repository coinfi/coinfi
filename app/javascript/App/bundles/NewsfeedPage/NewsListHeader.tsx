declare var window: {
  isMobile?: boolean
}

import * as React from 'react'
import Icon from '../../components/Icon'
import SectionHeader from '../../components/SectionHeader'
import SectionHeaderTight from '../../components/SectionHeaderTight'
import SearchCoins from '../../components/SearchCoins'
import FilterPanel from '../../components/FilterPanel'

// tslint:disable-next-line
const filterBtn = require('../../images/filter-btn.svg')

interface IProps {
  coins: string[]
  feedSources: any
}

interface IState {
  showFilters: boolean
}

const btnStyle: React.CSSProperties = {
  borderRadius: 0,
  display: 'inline-flex',
  padding: '16px',
  textTransform: 'none',
}

export default class NewsListHeader extends React.Component<IProps, IState> {
  public state = {
    showFilters: false,
  }

  public toggleFilters = () => {
    this.setState({
      showFilters: !this.state.showFilters,
    })
  }

  public toggleFilterPanel = () =>
    this.setState({ showFilters: !this.state.showFilters })

  public render() {
    return (
      <>
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
                <i className="material-icons f6 mr1">list</i>
                <span className="f6">Coins</span>
              </button>
              <button
                className="btn btn-blue btn-xs flex-auto justify-center"
                onClick={newsfeedTips}
                style={btnStyle}
              >
                <i className="material-icons f6 mr1">announcement</i>
                <span className="f6">Tips</span>
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
        {showFilters && <FilterPanel />}
      </>
    )
  }
}
