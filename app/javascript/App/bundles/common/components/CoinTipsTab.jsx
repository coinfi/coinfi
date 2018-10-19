import React from 'react'

const btnStyle = {
  padding: '16px',
  borderRadius: 0,
  textTransform: 'none',
  fontSize: 14,
}

export default function(props) {
  return (
    <div
      id="coin-tips-tab"
      className="b--b flex-none flex justify-between items-center bg-athens"
    >
      <div className="flex-auto flex items-center">
        <button
          className="btn btn-blue btn-xs flex-auto justify-center"
          onClick={props.showCoinListDrawer}
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
          onClick={props.showTips}
          style={btnStyle}
        >
          <i className="material-icons f6 mr1">announcement</i>
          <span className="f6">Tips</span>
        </button>
      </div>
    </div>
  )
}
