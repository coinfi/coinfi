import React, { Component} from 'react'
import CoinDetail from './../CoinDetail'
import axios from 'axios'

const ShowCoinDrawer = (props, event) => {
  const slug = event.target.getAttribute('slug')
  const url = `/api/coins/${slug}.json`
  console.log('show', url, event)
  props.showCoinDetail(slug)
}


class NewsCoinTags extends Component {

  render() {

  const { newsItem } = this.props
  return (
    <div>
      {newsItem.get('coin_link_data').map((data, index) => (
        <a
          key={index}
          className="tag pointer"
          onClick={ShowCoinDrawer.bind(this, this.props)}
          slug={data.get('slug')}
        >
          {data.get('symbol')}
        </a>
      ))}
    </div>

    )}

}

export default NewsCoinTags
