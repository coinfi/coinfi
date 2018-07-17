import React, { Component } from "react"
import debounce from "debounce"
import axios from "axios"
import newsfeedContainer from "../../containers/newsfeed"
import LayoutDesktop from "./LayoutDesktop"
import LayoutTablet from "./LayoutTablet"
import LayoutMobile from "./LayoutMobile"
import Immutable from "immutable"

class NewsfeedPage extends Component {
  state = {
    initialRenderTips: false,
    liveCoinArr: []
  }

  componentWillMount() {
    window.addEventListener("resize", debounce(() => this.forceUpdate()), 500)
  }

  componentDidMount() {
    window.twttr = (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {}
      if (d.getElementById(id)) return t
      js = d.createElement(s)
      js.id = id
      js.src = "https://platform.twitter.com/widgets.js"
      fjs.parentNode.insertBefore(js, fjs)

      t._e = []
      t.ready = function(f) {
        t._e.push(f)
      }

      return t
    })(document, "script", "twitter-wjs")
  }

  addCoinsToWatchlist(symbol) {
    var req = "/api/coins.json?q[symbol_eq]=" + symbol
    let liveCoinArrAdd = _.uniqBy(_.merge(this.state.liveCoinArr, this.props.coins), function(value){return value.get('symbol')})

    axios
      .get(req)
      .then(data => {
        const str = data.data.payload[0]
        if (this.props.coins.length) {
          var newMap = Immutable.Map(str)
          liveCoinArrAdd.push(newMap)
          liveCoinArrAdd = _.uniqBy(liveCoinArrAdd, function(value){return value.get('symbol')})

        }
      })
      .catch(error => {
        console.log(error)
      })

    this.setState({
      liveCoinArr: liveCoinArrAdd
    })
  }

  newsfeedTips() {
    this.setState({ initialRenderTips: !this.state.initialRenderTips })
  }

  render() {
    let coinArr
    if (this.state.liveCoinArr.length) {
      coinArr = this.state.liveCoinArr
    } else {
      coinArr = this.props.coins
    }
      // coinArr = _.uniqBy(coinArr, function(value){return value.get('id')})

    if (window.isMobile) {
      return (
        <LayoutMobile
          {...this.props}
          newsfeedTips={event => this.newsfeedTips(event)}
          initialRenderTips={this.state.initialRenderTips}
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          {...this.props}
          initialRenderTips={this.state.initialRenderTips}
        />
      )
    } else {
      if (this.state.liveCoinArr.length) {
        return (
          <LayoutDesktop
            {...this.props}
            initialRenderTips={this.state.initialRenderTips}
            addCoinsToWatchlist={() => this.addCoinsToWatchlist.bind(this)}
            coins={this.state.liveCoinArr}
          />
        )
      }
      return (
        <LayoutDesktop
          {...this.props}
          initialRenderTips={this.state.initialRenderTips}
          addCoinsToWatchlist={() => this.addCoinsToWatchlist.bind(this)}
          coins={this.props.coins}
        />
      )
    }
  }
}

export default newsfeedContainer(NewsfeedPage)
