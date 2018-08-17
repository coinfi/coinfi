import React from 'react'

const ListingsHeader = (props) => {
  return (
    <React.Fragment>
      <div className="b--b flex-none flex justify-between items-center bg-athens">
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
              onClick={newsfeedTips}
            >
              <img style={{ height: 10 }} src={bulbIcon} />
              <span style={{ marginLeft: 5 }}>Tips</span>
            </button>
          </Fragment>
        </div>
      </div>

      <div className="flex f6 bg-athens">
        <div className="fl w-third pa2">Pair</div>
        <div className="fl w-third pa2">Exchange</div>
        <div className="fl w-third pa2">Date Detected</div>
      </div>
    </React.Fragment>
  )
}

export default ListingsHeader
