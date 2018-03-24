import React, { Component } from 'react'
import Container from '../containers/CoinContainer'

class HomePage extends Component {
  render() {
    const { coin } = this.props
    return (
      <div className="container">
        <div className="row no-gutter">
          <div className="col-xs-12 col-md-6 col-lg-4">
            <div className="bg-white tc pa3">
              <img
                className="w4e"
                src={coin.get('imageUrl')}
                alt={coin.get('name')}
              />
              <h1 className="title mt2">{coin.get('name')}</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Container(HomePage)
