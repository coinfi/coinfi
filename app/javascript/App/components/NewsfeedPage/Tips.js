import React from 'react'
import Icon from '../Icon'

const titleStyle = {
  fontSize: '1.13rem',
  fontWeight: 'bold'
}

const bottomTitleStyle = Object.assign({}, titleStyle)

titleStyle.borderBottom = '1px solid rgba(0, 0, 0, 0.12)',
titleStyle.paddingLeft = 15
titleStyle.paddingBottom = 10
bottomTitleStyle.borderTop = '1px solid rgba(0, 0, 0, 0.12)'
bottomTitleStyle.paddingTop = 15
bottomTitleStyle.paddingBottom = 0
bottomTitleStyle.marginBottom = 0

const listTextNodeStyle = {width:'90%', marginLeft:10}

const listNumberStyle = {
  background: 'rgb(47, 174, 237)',
  borderRadius: 40,
  color: '#fff',
  width: 18,
  paddingLeft: 6,
  paddingTop: 2,
  fontSize: 10,
  verticalAlign: 'top'
}

export default ({ closeTips }) => {
  return (
    <div className="lh-copy">
      <div>
        <div style={{paddingTop:'15px'}}>
          <div style={{float:'right', marginRight: '15px'}} >
            {closeTips && <Icon name="times" className="f4 slate" regular onClick={closeTips} />}
          </div>
          <h2 className='tc mt0' style={titleStyle}>CoinFi News</h2>
        </div>
        <div style={{margin:20}}>
          <div style={{fontSize:'.8rem'}}>
            CoinFi News gives crypto investors like you an informational advantage
            by filtering out the noise and showing you how news is impacting coin
            price.
          </div>
          <h4 style={{fontSize:'.88rem'}}>Tips:</h4>
          <ol className='tips'>
            <li>
              <div style={listNumberStyle}>1</div>
              <div style={listTextNodeStyle}>Add coins to your watchlist to customize your news feed.</div>
            </li>
            <li>
              <div style={listNumberStyle}>2</div>
              <div style={listTextNodeStyle}> Use filters to drill down on specific news categories, types, and sources.  </div>
            </li>
            <li>
              <div style={listNumberStyle}>3</div>
              <div style={listTextNodeStyle}> Search or click on a coin ticker to view coin-specific news and coin data.  </div>
            </li>
            <li>
              <div style={listNumberStyle}>4</div>
              <div style={listTextNodeStyle}> See how news historically impacts a coin's price using CoinFi's Price Chart news annotations.  </div>
            </li>
            <li>
              <div style={listNumberStyle}>5</div>
              <div style={listTextNodeStyle}> Enable email and browser notifications to stay up-to-date on the latest market moving news  </div>
            </li>
          </ol>

        </div>

        <div style={{paddingTop:'15px'}}>
          <h2 className='tc mt0' style={bottomTitleStyle}>Get the most out of CoinFi News</h2>
          <div style={{margin:20, marginTop:0}}>
            <div style={{
              fontSize:'.8rem',
              textAlign: 'center',
              marginBottom: 20,
              marginTop: 10
            }}>
              Be the first to know about the latest market moving news
            </div>
            <button
              className="btn btn-blue btn-l w-100"
              style={{
                padding: '.8rem 2rem',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >Sign up</button>
          </div>
        </div>


      </div>
    </div>

  )
}
