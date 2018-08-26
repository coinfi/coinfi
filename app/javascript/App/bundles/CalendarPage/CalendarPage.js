import React, { Component, Fragment } from 'react'
import LayoutDesktop from '../../components/LayoutDesktop'
import LayoutTablet from '../../components/LayoutTablet'
import LayoutMobile from '../../components/LayoutMobile'
import CoinListContext from '../../contexts/CoinListContext'
import CoinListWrapper from '../common/components/CoinListWrapper'

class CalendarPage extends Component {
  render() {
    return (
      <CoinListContext.Consumer>
        {() => {
          if (window.isMobile)
            return (
              <LayoutMobile
                mainSection={<Fragment>This is a mobile site</Fragment>}
              />
            )
          if (window.isTablet)
            return (
              <LayoutTablet
                mainSection={<Fragment>This is a tablet site</Fragment>}
              />
            )

          return (
            <LayoutDesktop
              leftSection={<CoinListWrapper />}
              centerSection={
                <div style={{ margin: 20, textAlign: 'center' }}>
                  The new calendar page is in construction
                </div>
              }
            />
          )
        }}
      </CoinListContext.Consumer>
    )
  }
}

export default CalendarPage
