import React, { Component } from 'react'
import debounce from 'debounce'
import newsfeedContainer from '../../containers/newsfeed'
import LayoutDesktop from './LayoutDesktop'
import LayoutTablet from './LayoutTablet'
import LayoutMobile from './LayoutMobile'

class NewsfeedPage extends Component {
  state = {
    initialRenderTips: false
  }

  addCoinsToWatchlist() {
    console.log('added')
    var req = '/api/coins.json?q%5Bsymbol_cont%5D=BAS'
  }

  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
  }

  newsfeedTips() {
    this.setState({initialRenderTips: !this.state.initialRenderTips})
  }

  render() {
    console.log('newsfeedindex render')
    if (window.isMobile) {
      return <LayoutMobile {...this.props} newsfeedTips={(event) => this.newsfeedTips(event)} initialRenderTips={this.state.initialRenderTips} />
    } else if (window.isTablet) {
      return <LayoutTablet {...this.props} initialRenderTips={this.state.initialRenderTips} />
    } else {
      return <LayoutDesktop {...this.props} initialRenderTips={this.state.initialRenderTips} addCoinsToWatchlist={this.addCoinsToWatchlist} />
    }
  }
}

export default newsfeedContainer(NewsfeedPage)
