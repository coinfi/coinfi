import React from 'react'

export default function(props) {
  return (
    <div
      className="pa3 b--b flex-none flex justify-between items-center bg-athens"
      style={{ height: 60 }}
    >
      <div
        className="flex items-center flex-auto"
        style={{ justifyContent: 'flex-end' }}
      >
        {!window.isMobile && (
          <button
            className="btn btn-blue btn-xs coins-btn mr2"
            style={
              window.isMobile
                ? {
                    ...{
                      background: '#2495ce',
                      flex: 1,
                      textTransform: 'none',
                    },
                  }
                : {}
            }
          >
            <i className="material-icons f6 mr2">list</i>
            Coins
          </button>
        )}
        <button
          className="btn btn-xs btn-white filter-btn ml2"
          onClick={props.toggleFilterPanel}
        >
          <i className="material-icons f6 mr2">filter_list</i>
          Filters
        </button>
      </div>
    </div>
  )
}
