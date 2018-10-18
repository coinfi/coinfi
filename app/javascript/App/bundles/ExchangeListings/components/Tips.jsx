import React from 'react'
import Icon from '../../common/components/Icon'
const chartIcon = require('~/images/chartIcon.svg')
const filterIcon = require('~/images/filterIcon.svg')
const listIcon = require('~/images/listIcon.svg')

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

export default ({ closeTips, user, loggedIn }) => {
  const userIsLoggedIn = !!(user || loggedIn)
  return (
    <div className="lh-copy">
      <div>
        <div
          style={{
            paddingTop: '15px',
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
            CoinFi Exchange Listings
          </h2>
        </div>
        <div style={{ margin: 20 }}>
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
                Add coins to your watchlist <img src={listIcon} /> to receive
                notifications on your exchange listings when you subscribe.
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>2</div>
              <div style={listTextNodeStyle}>
                Use filters <img src={filterIcon} /> to drill down on specific
                exchanges, coins, or dates of listings.
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>3</div>
              <div style={listTextNodeStyle}>
                Click on a coin to see how historical exchange listings have
                impacted the price over time <img src={chartIcon} />
              </div>
            </li>
            <li>
              <div style={listNumberStyle}>5</div>
              <div style={listTextNodeStyle}>
                Enable email and browser push notifications to stay up-to-date
                on new exchange listings for your portfolio.
              </div>
            </li>
          </ol>
        </div>

        {!userIsLoggedIn && (
          <div style={{ paddingTop: '15px' }} className="signup-cta-wrap">
            <h2 className="tc mt0">
              Get the most out of CoinFi Exchange Listings
            </h2>
            <div style={{ margin: '0 20px 20px', display: 'grid' }}>
              <div
                style={{
                  fontSize: '.8rem',
                  textAlign: 'center',
                  marginBottom: 20,
                  marginTop: 10,
                }}
              >
                Be the first to know about the latest exchange listings.
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
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
