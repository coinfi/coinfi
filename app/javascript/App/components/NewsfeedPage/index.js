import React, { Component } from 'react'
import debounce from 'debounce'
import axios from 'axios'
import newsfeedContainer from '../../containers/newsfeed'
import LayoutDesktop from './LayoutDesktop'
import LayoutTablet from './LayoutTablet'
import LayoutMobile from './LayoutMobile'
import Immutable from 'immutable'
import _ from 'lodash'

class NewsfeedPage extends Component {
  state = {
    initialRenderTips: false,
    liveCoinArr: [],
  }

  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
  }

  removeCoinsWatchlist(symbol) {
    const liveCoinArrAdd = this.state.liveCoinArr.filter(
      (item) => item.get('symbol') !== symbol,
    )
    this.setState({
      liveCoinArr: liveCoinArrAdd,
    })
  }

  addCoinsToWatchlist(symbol) {
    let req = `/api/coins.json?q[symbol_eq]=${symbol}`
    let liveCoinArrAdd = _.uniqBy(
      _.merge(this.state.liveCoinArr, this.props.coins),
      (value) => {
        return value.get('symbol')
      },
    )

    axios
      .get(req)
      .then((data) => {
        const str = data.data.payload[0]
        if (this.props.coins.length) {
          let newMap = Immutable.Map(str)
          liveCoinArrAdd.push(newMap)
          liveCoinArrAdd = _.uniqBy(liveCoinArrAdd, (value) => {
            return value.get('symbol')
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })

    this.setState({
      liveCoinArr: liveCoinArrAdd,
    })
  }

  newsfeedTips() {
    this.setState({ initialRenderTips: !this.state.initialRenderTips })
  }

  render() {
    let coinsCollection
    if (this.state.liveCoinArr.length) {
      coinsCollection = this.state.liveCoinArr
    } else {
      coinsCollection = this.props.coins
    }

    if (window.isMobile) {
      return (
        <LayoutMobile
          {...this.props}
          newsfeedTips={(event) => this.newsfeedTips(event)}
          initialRenderTips={this.state.initialRenderTips}
          addCoinsToWatchlist={() => this.addCoinsToWatchlist.bind(this)}
          removeCoinsWatchlist={() => this.removeCoinsWatchlist.bind(this)}
          coins={coinsCollection}
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          {...this.props}
          initialRenderTips={this.state.initialRenderTips}
          addCoinsToWatchlist={() => this.addCoinsToWatchlist.bind(this)}
          removeCoinsWatchlist={() => this.removeCoinsWatchlist.bind(this)}
          coins={coinsCollection}
        />
      )
    } else {
      return (
        <LayoutDesktop
          {...this.props}
          initialRenderTips={this.state.initialRenderTips}
          addCoinsToWatchlist={() => this.addCoinsToWatchlist.bind(this)}
          removeCoinsWatchlist={() => this.removeCoinsWatchlist.bind(this)}
          coins={coinsCollection}
        />
      )
    }
  }
}

export default newsfeedContainer(NewsfeedPage)
