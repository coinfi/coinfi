import React from 'react'

export default ({ applyFilters }) => (
  <button
    className="btn btn-blue btn-xs ml3"
    onClick={applyFilters}
    style={{
      textTransform: 'none',
      padding: '8px 20px',
      fontSize: '.88rem',
    }}
  >
    Apply
  </button>
)
