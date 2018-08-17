import React from 'react'
import Icon from '../../Icon'
import bulbIcon from '../../../images/bulbIcon.svg'
import filterBtn from '../../../images/filter-btn.svg'
// import SectionHeader from '../SectionHeader'
// import SectionHeaderTight from '../SectionHeaderTight'
// import SearchCoins from '../SearchCoins'
// import FilterPanel from '../FilterPanel'
// import FilterTags from '../FilterTags'

const ListingsHeader = (props) => {
  const btnStyle = {
    padding: '18px',
    borderRadius: 0,
  }

  return (
    <React.Fragment>
      {/* coins/tips - mobile - section header */}

      <div className="b--b flex-none flex justify-between items-center bg-athens">
        <div className="flex-auto flex items-center">
          <button
            className="btn btn-blue btn-xs"
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
          >
            <img style={{ height: 10 }} src={bulbIcon} />
            <span style={{ marginLeft: 5 }}>Tips</span>
          </button>
        </div>
      </div>

      {/* end - coins/tips - mobile - section header */}

      {/* coins/tips - section header */}
      <div
        className="pa3 b--b flex-none flex justify-between items-center bg-athens"
        style={{ height: 60 }}
      >
        <div className="flex items-center flex-auto">
          {!window.isMobile && (
            <button
              className="btn btn-blue btn-xs coins-btn mr2"
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
            className="btn btn-xs btn-white filter-btn ml2"
          >
            <img style={{ height: 10, marginRight: 10 }} src={filterBtn} />
            Filters
          </button>
        </div>
      </div>
      {/* end - coins/tips - section header */}

      <div className="flex f6 bg-athens">
        <div className="fl w-third pa2">Pair</div>
        <div className="fl w-third pa2">Exchange</div>
        <div className="fl w-third pa2">Date Detected</div>
      </div>
    </React.Fragment>
  )
}

export default ListingsHeader
