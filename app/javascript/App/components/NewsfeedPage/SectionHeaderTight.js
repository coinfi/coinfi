import React, { Fragment } from 'react'

const SectionHeaderTight = ({ children }) => {
  console.log(children[0])
return (
  <Fragment>
    <div className="b--b flex-none flex justify-between items-center bg-athens">
      {children}
    </div>
  </Fragment>
)
}

export default SectionHeaderTight
