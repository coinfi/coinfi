import React, { Component } from 'react'
import debounce from 'debounce'
import axios from 'axios'
import newsfeedContainer from '../../containers/newsfeed'
import LayoutDesktop from './LayoutDesktop'
import LayoutTablet from './LayoutTablet'
import LayoutMobile from './LayoutMobile'
import Immutable from 'immutable'

class NewsfeedPage extends Component {
  state = {
    initialRenderTips: false
  }

  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
  }

  componentDidMount() {
    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    }(document, "script", "twitter-wjs"));

    // var req = '/api/coins.json?q%5Bsymbol_cont%5D=BAS'
    // console.log('componentDidMount')
    // axios
    //   .get(`req`)
    //   .then(({ data: { data: { children } } }) => {
    //     this.setState({ posts: children })
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  }

  addCoinsToWatchlist(symbol) {
    console.log('added ', symbol)
    var req = '/api/coins.json?q%5Bsymbol_cont%5D=BAS'
    axios
      .get(req)
      .then((data) => {
        console.log(data, 'add response')
        // this.setState({ posts: children })
        // todo: add this coin to component state
      })
      .catch(error => {
        console.log(error)
      })

    console.log('add coins event')

  }

  newsfeedTips() {
    this.setState({initialRenderTips: !this.state.initialRenderTips})
  }

  render() {

   var str = {
  "id": 24,
  "name": "Agoras Tokens",
  "symbol": "AGRS",
  "slug": "agoras-tokens",
  "image_url": "https://gitcdn.link/repo/cjdowner/cryptocurrency-icons/master/svg/color/agrs.svg",
  "market_info": {
    "available_supply": "41.99M",
    "max_supply": null
  }
}

var coinsArr = []
if (this.props.coins.length) {
  var newMap = Immutable.Map(str)
  console.log(newMap)
  coinsArr = this.props.coins
  coinsArr.push(newMap)
  //todo: push the coin to the coins props
}

    if (window.isMobile) {
      return <LayoutMobile {...this.props} newsfeedTips={(event) => this.newsfeedTips(event)} initialRenderTips={this.state.initialRenderTips} />
    } else if (window.isTablet) {
      return <LayoutTablet {...this.props} initialRenderTips={this.state.initialRenderTips} />
    } else {
      console.log('newsfeedindex this.props.coins', this.props.coins)
      return <LayoutDesktop {...this.props} initialRenderTips={this.state.initialRenderTips} addCoinsToWatchlist={() => this.addCoinsToWatchlist.bind(this)} coins={coinsArr} />
    }
  }
}

export default newsfeedContainer(NewsfeedPage)
