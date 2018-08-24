import React from 'react'

export default ({ toggleFilterPanel }) => (
  <button
    className="btn btn-white btn-xs"
    onClick={toggleFilterPanel}
    style={{
      background: 'none',
      border: 'none',
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: '14px',
      color: 'rgba(0, 0, 0, 0.54)',
    }}
  >
    Cancel
  </button>
)
