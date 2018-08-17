import * as React from 'react'
import Icon from './Icon'
// TODO: define svg as component
// import bulbIcon from '../images/bulbIcon.svg'

interface Props {}

const btnStyle = {
  padding: '18px',
  borderRadius: 0,
}

export default function(props: Props) {
  return (
    <div className="b--b flex-none flex justify-between items-center bg-athens listing-header-coins-tips-tabs">
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
          {/*  TODO: define svg as component */}
          {/* <img style={{ height: 10 }} src={bulbIcon} /> */}
          <span style={{ marginLeft: 5 }}>Tips</span>
        </button>
      </div>
    </div>
  )
}
