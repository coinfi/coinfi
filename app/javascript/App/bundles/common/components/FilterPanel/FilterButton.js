import React from 'react'

export default ({ onClick }) => (
  <button
    data-heap="news-click-filter-button"
    className="btn btn-xs btn-white filter-btn mr2"
    onClick={onClick}
  >
    <i className="material-icons f6 mr2">filter_list</i>
    Filters
  </button>
)
