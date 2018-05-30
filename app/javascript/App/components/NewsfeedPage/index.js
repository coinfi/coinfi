import React, { Component } from 'react'
import debounce from 'debounce'
import newsfeedContainer from '../../containers/newsfeed'
import LayoutDesktop from './LayoutDesktop'
import LayoutTablet from './LayoutTablet'
import LayoutMobile from './LayoutMobile'

class NewsfeedPage extends Component {
  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
  }
  render() {
    if (window.isMobile) {
      return <LayoutMobile {...this.props} />
    } else if (window.isTablet) {
      return <LayoutTablet {...this.props} />
    } else {
      return <LayoutDesktop {...this.props} />
    }
  }
}

export default newsfeedContainer(NewsfeedPage)
