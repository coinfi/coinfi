import React from 'react'
const filterBtn = require('~/images/filterBtn.svg') // tslint:disable-line

export default ({ onClick }) => (
  <button
    data-heap="news-click-filter-button"
    className="btn btn-xs btn-white filter-btn mr2"
    onClick={onClick}
  >
    <img className="f6 mr2" src={filterBtn} alt="Filter Icon" />
    Filters
  </button>
)
