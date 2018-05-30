import React, { Component } from 'react'
import newsfeedContainer from '../../containers/newsfeed'
import CoinListItem from './CoinListItem'
import NewsItemList from './NewsItemList'
import NewsItemBody from './NewsItemBody'
import CoinBody from './CoinBody'
import Tips from './Tips'
import Filters from '../Filters'

class NewsfeedPage extends Component {
  render() {
    const { coins, activeEntity } = this.props
    return (
      <div>
        <div id="site-subheader">
          <div className="container-wide ph4 pb4">
            <div className="flex items-center">
              <div>
                <h1>Newsfeed</h1>
              </div>
              <div className="pl4">
                <Filters {...this.props} filterData={{ coins }} />
              </div>
            </div>
          </div>
        </div>
        <div className="container-wide ph4-l">
          <div className="bg-white">
            <div className="row no-gutter flex">
              <div className="col-xs-2">
                {coins.map((coin, index) => (
                  <CoinListItem key={index} coin={coin} {...this.props} />
                ))}
              </div>
              <div className="col-xs-5 bl b--light-gray">
                <NewsItemList {...this.props} />
              </div>
              <div className="col-xs-5 bl b--light-gray">
                {activeEntity ? (
                  <div>
                    {activeEntity.type === 'coin' ? (
                      <CoinBody {...this.props} />
                    ) : (
                      <NewsItemBody {...this.props} />
                    )}
                  </div>
                ) : (
                  <Tips />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default newsfeedContainer(NewsfeedPage)
