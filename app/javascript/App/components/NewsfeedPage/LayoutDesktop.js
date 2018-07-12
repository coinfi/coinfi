import React from 'react'
import axios from 'axios'
import CoinList from './CoinList'
import NewsList from './NewsList'
import NewsListHeader from './NewsListHeader'
import BodySection from './BodySection'

export default class LayoutDesktop extends React.Component {

// export default function(props) {

  componentDidMount() {
    var req = '/api/coins.json?q%5Bsymbol_cont%5D=BAS'
    axios
      .get(req)
      .then(({ data: { data: { children } } }) => {
        console.log('add response')
        // this.setState({ posts: children })
      })
      .catch(error => {
        console.log(error)
      })

    // console.log('add desktop: did mount')
  }

  render() {

    const {props} = this

    return (
      <div className="flex flex-column flex-auto">
        <div className="row no-gutter flex-auto bg-white">
          <div className="col-xs-2 relative flex flex-column b--l">
            <CoinList {...props} />
          </div>
          <div className="col-xs-5 relative flex flex-column b--l">
            <NewsListHeader {...props} />
            <NewsList {...props} />
          </div>
          <div className="col-xs-5 relative overflow-y-auto b--l b--r">
            <BodySection {...props} />
          </div>
        </div>
      </div>
    )

  }
}
