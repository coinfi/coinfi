import React from 'react'

const CalendarListEventHeader = (props) => {
  return (
    <div
      className="b--b bg-athens overflow-hidden sticky"
      style={{ height: props.height || 'auto' }}
    >
      <div className="pa-default">
        <div className="flex justify-center flex-wrap">
          <div className="f6 silver">{props.children}</div>
        </div>
      </div>
    </div>
  )
}

export default CalendarListEventHeader
