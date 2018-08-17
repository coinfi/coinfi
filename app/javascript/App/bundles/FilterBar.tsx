import * as React from 'react'
import Icon from './Icon'
// TODO: define svg as component
// import filterBtn from '../images/filter-btn.svg'

declare global {
  interface Window {
    isMobile?: any
  }
}

interface Props {
  toggleFilterPanel: any
}

const btnStyle = {
  padding: '18px',
  borderRadius: 0,
}

export default function(props: Props) {
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
          onClick={props.toggleFilterPanel}
        >
          {/* TODO: define svg as component */}
          {/*    <img style={{ height: 10, marginRight: 10 }} src={filterBtn} /> */}
          Filters
        </button>
      </div>
    </div>
  )
}
