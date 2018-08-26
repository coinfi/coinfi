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
        {(payload) => {
          let enhancedProps = { ...this.props, coins: payload.coinlist }
          return (
            <Fragment>
              <LayoutDesktop
                leftSection={<CoinListWrapper {...enhancedProps} />}
                centerSection={
                  <div style={{ margin: 20, textAlign: 'center' }}>
                    {' '}
                    The new calendar page is in construction
                  </div>
                }
              />
            </Fragment>
          )
        }}
      </CoinListContext.Consumer>
    )
  }
}

export default CalendarPage
