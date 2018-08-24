import React from 'react'

export default ({ resetFilters }) => (
  <button
    className="btn btn-white btn-xs"
    onClick={resetFilters}
    style={{
      background: 'none',
      border: 'none',
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: '12px',
      color: '#2faeed',
    }}
  >
    Reset
  </button>
)
