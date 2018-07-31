import React from 'react'

const SectionHeader = ({ children }) => (
  <div
    className="pa3 b--b flex-none flex justify-between items-center bg-athens"
    style={{ height: 60 }}
  >
    {children}
  </div>
)

export default SectionHeader
