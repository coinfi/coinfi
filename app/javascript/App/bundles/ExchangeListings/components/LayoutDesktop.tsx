import * as React from 'react'
//import CoinList from '../NewsfeedPage/CoinList'
import ListingsHeader from './ListingsHeader'
import ListingsList from './ListingsList'
import BodySection from './BodySection'

export interface LayoutProps {
  showFilterPanel: Boolean
  toggleFilterPanel: Function
  user: Boolean
}

class LayoutDesktop extends React.Component<LayoutProps> {
  state = { showFilterPanel: false }
  toggleFilterPanel() {
    this.setState({
      showFilterPanel: !this.state.showFilterPanel,
    })
  }
  render() {
    const { props } = this
    return (
      <div className="flex flex-column flex-auto">
        <div className="row no-gutter flex-auto bg-white">
          <div className="col-xs-6 relative flex flex-column b--l">
            <ListingsHeader
              {...props}
              showFilterPanel={this.state.showFilterPanel}
              toggleFilterPanel={this.toggleFilterPanel.bind(this)}
            />
            <ListingsList {...props} />
          </div>
          <div className="col-xs-6 relative overflow-y-auto b--l b--r">
            <BodySection {...props} />
          </div>
        </div>
      </div>
    )
  }
}

export default LayoutDesktop
