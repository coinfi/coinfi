import React, { Component, Fragment } from 'react'
import debounce from 'debounce'
import axios from 'axios'
import Immutable from 'immutable'
import _ from 'lodash'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import green from '@material-ui/core/colors/green'
import { withStyles } from '@material-ui/core/styles'

import newsfeedContainer from '../../containers/newsfeed'
import LayoutDesktop from '../LayoutDesktop'
import LayoutTablet from '../LayoutTablet'
import LayoutMobile from '../LayoutMobile'
import CoinList from '../CoinList/CoinList'
import CoinListDrawer from '../CoinList/CoinListDrawer'
import NewsList from './NewsList'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'
import BodySectionDrawer from '../BodySectionDrawer'

const styles = {
  root: {
    backgroundColor: green[600],
  },
}

class NewsfeedPage extends Component {
  state = {
    initialRenderTips: false,
    liveCoinArr: [],
    showLoginNotification: true,
  }

  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500)
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      console.log('////////////// CONGRATS USER IS LOGGED IN!!!')
    } else {
      console.log('////////////// OH NO, THE USER IS NOT LOGGED IN!!!')
    }
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
    this.setState((prevState) => ({
      initialRenderTips: !prevState.initialRenderTips,
    }))
  }

  closeNotification() {
    this.setState({ showLoginNotification: false })
    console.log('IT SHOULD BE CLOSED NOW')
  }

  renderNotifications(classes) {
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={this.props.loggedIn && this.state.showLoginNotification}
          classes={{ root: classes.root }}
          onClose={this.closeNotification.bind(this)}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={<span id="message-id">User is logged in</span>}
        >
          <SnackbarContent>aaaa</SnackbarContent>
        </Snackbar>
      </div>
    )
  }

  render() {
    let coinsCollection
    if (this.state.liveCoinArr.length) {
      coinsCollection = this.state.liveCoinArr
    } else {
      coinsCollection = this.props.coins
    }

    let enhancedProps = {
      ...this.props,
      newsfeedTips: (event) => this.newsfeedTips(event),
      initialRenderTips: this.state.initialRenderTips,
      addCoinsToWatchlist: () => this.addCoinsToWatchlist.bind(this),
      removeCoinsWatchlist: () => this.removeCoinsWatchlist.bind(this),
      coins: coinsCollection,
    }

    const { classes } = this.props

    if (window.isMobile) {
      return (
        <LayoutMobile
          {...enhancedProps}
          mainSection={
            <Fragment>
              <NewsListHeader {...enhancedProps} />
              <NewsList {...enhancedProps} />
              {this.renderNotifications(classes)}
            </Fragment>
          }
          modalName="newsfeedModal"
          modalSection={<BodySection {...enhancedProps} mobileLayout />}
          drawerSection={
            <Fragment>
              <CoinListDrawer {...enhancedProps} />
              <BodySectionDrawer
                {...enhancedProps}
                bodySection={<BodySection {...enhancedProps} />}
              />
            </Fragment>
          }
        />
      )
    } else if (window.isTablet) {
      return (
        <LayoutTablet
          {...enhancedProps}
          leftSection={
            <Fragment>
              <NewsListHeader {...enhancedProps} />
              <NewsList {...enhancedProps} />
              {this.renderNotifications(classes)}
            </Fragment>
          }
          rightSection={<BodySection {...enhancedProps} />}
          drawerSection={<CoinListDrawer {...enhancedProps} />}
        />
      )
    } else {
      return (
        <LayoutDesktop
          {...enhancedProps}
          leftSection={<CoinList {...enhancedProps} />}
          centerSection={
            <Fragment>
              <NewsListHeader {...enhancedProps} />
              <NewsList {...enhancedProps} />
              {this.renderNotifications(classes)}
            </Fragment>
          }
          rightSection={<BodySection {...enhancedProps} />}
        />
      )
    }
  }
}

export default newsfeedContainer(withStyles(styles)(NewsfeedPage))
