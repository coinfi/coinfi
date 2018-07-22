import React, { Fragment } from 'react'

const SectionHeaderTight = ({ children }) => {
  return (
    <Fragment>
      <div className="b--b flex-none flex justify-between items-center bg-athens">
        {children}
      </div>
    </Fragment>
  )
}

export default SectionHeaderTight
