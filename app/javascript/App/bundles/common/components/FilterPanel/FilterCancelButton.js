import React from 'react'
import { black54 } from '../../styles/colors'

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
      color: black54,
    }}
  >
    Cancel
  </button>
)
