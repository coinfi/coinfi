import React from 'react'
import loadingImg from '../images/loading.svg'

export default ({ className }) => {
  return (
    <div className={`loading-indicator ${className || ''}`}>
      <img src={loadingImg} alt="" />
    </div>
  )
}
