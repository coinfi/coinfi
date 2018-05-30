import React from 'react'
import Filters from '../Filters'

export default (props) => {
  const { coins } = props
  return (
    <div id="site-subheader">
      <div className="container-wide ph4 pb4">
        <div className="flex items-center">
          <div>
            <h1>Newsfeed</h1>
          </div>
          <div className="pl4">
            <Filters {...props} filterData={{ coins }} />
          </div>
        </div>
      </div>
    </div>
  )
}
