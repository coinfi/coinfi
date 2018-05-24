import React, { Component } from 'react'
import newsfeedContainer from '../../containers/newsfeed'
import CoinListItem from './CoinListItem'
import ArticleList from './ArticleList'
import ArticleBody from './ArticleBody'
import CoinBody from './CoinBody'
import Tips from './Tips'

class NewsfeedPage extends Component {
  state = { currentItem: {} }
  setCurrentItem = (currentItem) => {
    this.props.setUI(['newsfeed', 'bodyVisible', true])
    this.setState({ currentItem })
  }
  render() {
    const { coins, currentUI } = this.props
    const { currentItem } = this.state
    const { setCurrentItem } = this
    const componentProps = {
      ...this.props,
      setCurrentItem,
      currentItem
    }
    return (
      <div>
        <div id="site-subheader">
          <div className="container-wide ph4 pb4">
            <h1>Newsfeed</h1>
          </div>
        </div>
        <div className="container-wide ph4-l">
          <div className="bg-white">
            <div className="row no-gutter flex">
              <div className="col-xs-2">
                {coins.map((coin, index) => (
                  <CoinListItem key={index} coin={coin} {...componentProps} />
                ))}
              </div>
              <div className="col-xs-5 bl b--light-gray">
                <ColumnHeader>
                  <div>Search</div>
                  <div>Filters</div>
                </ColumnHeader>
                <ArticleList {...componentProps} />
              </div>
              <div className="col-xs-5 bl b--light-gray">
                {currentUI(['newsfeed', 'bodyVisible']) ? (
                  <div>
                    {currentItem.type === 'coin' ? (
                      <CoinBody {...componentProps} />
                    ) : (
                      <ArticleBody {...componentProps} />
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
