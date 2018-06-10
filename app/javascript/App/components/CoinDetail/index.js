import React, {Fragment, Component} from 'react';
import axios from 'axios';
import Icon from './../Icon';
import CoinCharts from '../CoinCharts'
import LoadingIndicator from '../LoadingIndicator'
import WatchButton from './../WatchButton'

export default class CoinDetail extends Component {
  state = {
    coinData: {},
    coinObjData: {}
  };

  componentDidMount() {
    const url = `/api/coins/${
      this.props.coinSlug
    }.json`;
    axios.get(url).then(response => {
      this.setState({
        coinData: response.data.payload,
      });
    });
  }

  render() {
    const coinData = this.state.coinData;
    const coinDetailStyle = {
      position:'absolute',
      background:'#fff',
      top:0,
      width:'100%',
      height:'100%'
    }
    const iconWrapStyle = {
      margin: '20px 10px',
      position: 'absolute',
      right: '10px',
      top: 0
    }
    const headerStyle = {
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 30
    }
    const marketCapStyle = {
      background: '#ecedee',
      width: '50%',
      margin: 'auto',
      textAlign: 'center',
      fontSize: 12,
      padding: 5
    }
    return (

      <div className="col-xs-12 col-md-4 flex flex-column" style={coinDetailStyle}>
        {!coinData.name && (
          <LoadingIndicator className="overlay bg-white-70" />
        )}

        <h1 className="ma0 lh-solid" style={headerStyle}>
          <span className="fw4"></span>
          <span className="f6 fw9 sans-alt" id="symbol" style={{fontSize:18}}>
            {coinData.name} ({coinData.symbol})
          </span>
        </h1>

        <div style={iconWrapStyle}>
          <Icon name="times" className="fr" onClick={this.props.hideCoinDetail} />
        </div>
        <div className="bg-white mb2">
          <div className="pa3 tr" />
          <div className="pa4 pt0">
            <div className="flex justify-center items-center mb4">
              {coinData.image_url && (
                <img alt="{coinData.name}" className="w3e h3e mr3 a1" height="32" src={coinData.image_url} width="32" />
              )}
            </div>

            {coinData.market_info && (
              <div className="f3 tc">
                ${coinData.market_info.price_usd}
                <span className="smaller2 b ml2">
                  <span className="sunset" style={{fontSize:18}}>{coinData.market_info.percent_change_24h}%</span>
                </span>
              </div>
            )}

          </div>
        </div>
        <div className="bg-white pa4 mb2">

          {coinData.market_info && (
              <div style={marketCapStyle}>
                <label>Market: </label>{coinData.market_info.market_cap_usd}
                <div className="dib f7 ml1">USD</div>
              </div>
          )}

          <WatchButton {...this.props} coinObj={this.state.coinObjData} coinDetail />

        </div>
        <div className="bg-white tc f7 pa4 mb2">
          Last updated: {} minutes ago
        </div>

        {coinData.market_info && (
          <CoinCharts
            symbol={coinData.symbol}
            priceData={coinData.prices_data}
            noTabs
          />
        )}
      </div>

    );
  }
}
