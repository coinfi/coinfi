import * as React from 'react'
import Icon from '../../components/Icon'

// tslint:disable-next-line
const chartIcon = require('../../images/chartIcon.svg')
// tslint:disable-next-line
const filterIcon = require('../../images/filterIcon.svg')
// tslint:disable-next-line
const listIcon = require('./../../images/listIcon.svg')

const titleStyle = {
  fontSize: '1.13rem',
  fontWeight: 700, // bold, typescript complains about string value for fontWeight property
  paddingBottom: 10,
  paddingLeft: 15,
}

const listTextNodeStyle = { width: '90%', marginLeft: 10, fontSize: '.88rem' }

const listNumberStyle = {
  background: 'rgb(47, 174, 237)',
  borderRadius: 40,
  color: '#fff',
  fontSize: 10,
  marginTop: 2,
  paddingLeft: 6,
  paddingTop: 2,
  verticalAlign: 'top',
  width: 18,
}

interface Props {
  closeTips?: () => void
  loggedIn?: boolean
}

export default ({ closeTips, loggedIn }: Props) => {
  return (
    <div className="lh-copy">
      <div>
        <div
          style={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            height: 60,
            paddingTop: '18px',
          }}
        >
          <div style={{ float: 'right', marginRight: '15px' }}>
            {closeTips && (
              <Icon
                name="times"
                className="f4 slate"
                regular={true}
                onClick={closeTips}
              />
            )}
          </div>
          <h2 className="mt0" style={titleStyle}>
            CoinFi News
          </h2>
        </div>
        <div className="pa3">
          <div style={{ fontSize: '.8rem' }}>
            CoinFi News gives crypto investors like you an informational
            advantage by filtering out the noise and showing you how news is
            impacting coin price.
          </div>
          <h4 style={{ fontSize: '.88rem' }}>Tips:</h4>
          <ol className="tips">
            <li>
              <div style={listNumberStyle}>1</div>
              <div style={listTextNodeStyle}>
                Add coins to your watchlist <img src={listIcon} /> to customize
                your news feed.
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>2</div>
              <div style={listTextNodeStyle}>
                Use filters <img src={filterIcon} /> to drill down on specific
                news categories, types, and sources.
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>3</div>
              <div style={listTextNodeStyle}>
                Search or click on a coin ticker to view coin-specific news and
                coin data.<img src={chartIcon} />
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>4</div>
              <div style={listTextNodeStyle}>
                See how news historically impacts a coin's price using CoinFi's
                Price Chart news annotations.
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>5</div>
              <div style={listTextNodeStyle}>
                Enable email and browser notifications to stay up-to-date on the
                latest market moving news.
              </div>
            </li>
          </ol>
        </div>

        {!loggedIn && (
          <div className="ph3 tc signup-cta-wrap">
            <h2 className="m0 pv3">Get the most out of CoinFi News!</h2>
            <div className="f6">
              Save coins into your Watchlist and be the first to know about the
              latest market moving news.
            </div>
            <button
              className="btn btn-blue btn-l w-30-ns mv3 b ttn"
              onClick={() => (window.location.href = '/register')}
            >
              Sign Up Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
