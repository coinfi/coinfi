import * as React from 'react'

const loadingImg = require('~/images/loading.svg') // tslint:disable-line

export default ({ className }: { className?: string }) => {
  return (
    <div className={`loading-indicator ${className || ''}`}>
      <img src={loadingImg} alt="" />
    </div>
  )
}
