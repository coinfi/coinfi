import React from 'react'
import Icon from '../Icon'

const titleStyle = {
  paddingBottom:10,
  borderBottom:'1px solid rgba(0, 0, 0, 0.12)',
  paddingLeft: 15,
  fontSize: '1.13rem'
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

        <div style={{margin:15, padding:15}}>

          <div style={{fontSize:'.8rem'}}>
            CoinFi News gives crypto investors like you an informational advantage
            by filtering out the noise and showing you how news is impacting coin
            price.
          </div>
          <h2>Tips</h2>
          <ul>
            <li>Add coins to your watchlist to customize your news feed.</li>
            <li>
              Use filters to drill down on specific news categories, types, and
              sources.
            </li>
            <li>
              Search or click on a coin ticker to view coin-specific news and coin
              data.
            </li>
            <li>
              See how news historically impacts a coin's price using CoinFi's Price
              Chart news annotations.
            </li>
            <li>
              Enable email and browser notifications to stay up-to-date on the
              latest market moving news.
            </li>
          </ul>
        </div>


      </div>
    </div>

  )
}
