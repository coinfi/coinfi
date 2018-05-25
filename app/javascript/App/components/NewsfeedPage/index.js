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
                <Filters
                  {...this.props}
                  filterData={{ coins: coins.map((c) => c.get('name')) }}
                />
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
                <ColumnHeader>
                  <div>Search</div>
                  <div>Filters</div>
                </ColumnHeader>
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

const ColumnHeader = ({ children }) => (
  <header className="bg-near-white bb b--light-gray f6 h3 ph3 flex items-center justify-between">
    {children}
  </header>
)

export default newsfeedContainer(NewsfeedPage)
