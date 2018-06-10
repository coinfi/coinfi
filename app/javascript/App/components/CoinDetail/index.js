import React, {Fragment, Component} from 'react';
import axios from 'axios';
import Icon from './../Icon';
import CoinCharts from '../CoinCharts'
import LoadingIndicator from '../LoadingIndicator'

export default class CoinDetail extends Component {
  state = {
    coinData: {},
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
    return (

      <div className="col-xs-12 col-md-4 flex flex-column" style={coinDetailStyle}>
        {!coinData.name && (
          <LoadingIndicator className="overlay bg-white-70" />
        )}

        <div style={{margin:'20px 10px'}}>
          <Icon name="times" className="fr" onClick={this.props.hideCoinDetail} />
        </div>
        <div className="bg-white mb2">
          <div className="pa3 tr" />
          <div className="pa4 pt0">
            <div className="flex justify-center items-center mb3">
              {coinData.image_url && (
                <img alt="{coinData.name}" className="w3e h3e mr3 a1" height="32" src={coinData.image_url} width="32" />
              )}
              <h1 className="ma0 lh-solid">
                <span className="fw4">{coinData.name}</span>
                <span className="f6 fw9 sans-alt" id="symbol">
                  {coinData.symbol}
                </span>
              </h1>
            </div>

            {coinData.market_info && (
              <div className="f3 tc">
                {coinData.market_info.price_usd}
                <span className="smaller2 b ml2">
                  <span className="sunset">{coinData.market_info.percent_change_24h}</span>
                </span>
              </div>
            )}

          </div>
        </div>
        <div className="bg-white pa4 mb2">

          {coinData.market_info && (
            <div className="row nt4 tc fw6">
              <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
                <label>Volume (24 h)</label>{coinData.market_info['24h_volume_usd']}
                <div className="dib f7 ml1">USD</div>
              </div>
              <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
                <label>Circulation</label>{coinData.market_info.available_supply}
                <div className="dib f7 ml1">BTC</div>
              </div>
              <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
                <label>Market Cap</label>{coinData.market_info.market_cap_usd}
                <div className="dib f7 ml1">USD</div>
              </div>
              <div className="stat-block col-xs-6 col-sm-3 col-md-12 col-lg-6 mt4">
                <label>Total Supply</label>{coinData.market_info.total_supply}
                <div className="dib f7 ml1">BTC</div>
              </div>
            </div>
          )}

        </div>
        <div className="bg-white tc f7 pa4 mb2">
          Last updated: {} minutes ago
        </div>

        {coinData.market_info && (
          <CoinCharts
            symbol={coinData.symbol}
            priceData={coinData.prices_data}
          />
        )}
      </div>

    );
  }
}
