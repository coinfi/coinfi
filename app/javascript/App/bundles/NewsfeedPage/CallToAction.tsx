import * as React from 'react'

interface Props {
  alignLeft?: boolean
}

export default ({ alignLeft }: Props) => {
  return (
    <div className={`ph3 tc signup-cta-wrap ${alignLeft ? '' : 'center'}`}>
      <h2 className="m0 pv3">Get the most out of CoinFi News!</h2>
      <div className="f6">
        Save coins into your Watchlist and be the first to know about the latest
        market moving news.
      </div>
      <button
        className="btn btn-blue mv3 b ttn"
        data-heap="news-click-signup-button"
        onClick={() => (window.location.href = '/register')}
      >
        Sign Up Now
      </button>
    </div>
  )
}
