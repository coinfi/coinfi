import React from 'react'
import Icon from '~/bundles/common/components/Icon'
const filterIcon = require('~/images/filterIcon.svg')
const bellIcon = require('~/images/bellIcon.svg')

const titleStyle = {
  fontSize: '1.13rem',
  fontWeight: 'bold',
}

titleStyle.paddingLeft = 15
titleStyle.paddingBottom = 10

const listTextNodeStyle = { width: '90%', marginLeft: 10, fontSize: '.88rem' }

const listNumberStyle = {
  background: 'rgb(47, 174, 237)',
  borderRadius: 40,
  color: '#fff',
  width: 18,
  paddingLeft: 6,
  paddingTop: 2,
  fontSize: 10,
  verticalAlign: 'top',
  marginTop: 2,
}

const btcIcon = {
  color: 'rgb(47, 174, 237)',
  fontWeight: 500,
}

export default ({ closeTips, user, loggedIn }) => {
  const userIsLoggedIn = !!(user || loggedIn)
  return (
    <div className="lh-copy">
      <div>
        <div
          style={{
            paddingTop: '18px',
            height: 60,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <div style={{ float: 'right', marginRight: '15px' }}>
            {closeTips && (
              <Icon
                name="times"
                className="f4 slate"
                regular
                onClick={closeTips}
              />
            )}
          </div>
          <h2 className="mt0" style={titleStyle}>
            CoinFi Events
          </h2>
        </div>
        <div className="pa3">
          <h4 style={{ fontSize: '.88rem' }}>Tips:</h4>
          <ol className="tips">
            <li>
              <div style={listNumberStyle}>1</div>
              <div style={listTextNodeStyle}>
                Use filters <img src={filterIcon} /> to drill down on specific
                events by coin, date, category or trending events.
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>2</div>
              <div style={listTextNodeStyle}>
                Search or click on coin ticker <span style={btcIcon}>BTC</span>{' '}
                to view coin-specific events and information.
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>4</div>
              <div style={listTextNodeStyle}>
                Enable email and browser notifications <img src={bellIcon} /> to
                stay up to date on new events for your coins.
              </div>
            </li>
          </ol>
        </div>

        {!userIsLoggedIn && (
          <div style={{ paddingTop: '15px' }} className="signup-cta-wrap">
            <h2 className="tc mt0">Get the most out of CoinFi Events</h2>
            <div style={{ margin: '0 20px 20px', display: 'grid' }}>
              <div
                style={{
                  fontSize: '.8rem',
                  textAlign: 'center',
                  marginBottom: 20,
                  marginTop: 10,
                }}
              >
                Be the first to know about the latest events
              </div>
              <button
                className="btn btn-blue btn-l w-100"
                style={{
                  padding: '.8rem 2rem',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  margin: 'auto',
                }}
                onClick={() => (window.location = '/sign_up')}
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
