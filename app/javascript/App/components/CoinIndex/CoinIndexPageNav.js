import React from 'react'

class CoinIndexPageNav extends React.Component {
  selectedPage() {
    console.log(window.location.search)
  }
  render() {
    this.selectedPage()
    const { pageArr } = this.props
    return (
      <ul
        className="ant-pagination ant-table-pagination"
        unselectable="unselectable"
        style={{ textAlign: 'center', float: 'none' }}
      >
        <li
          title="Previous Page"
          className="ant-pagination-disabled ant-pagination-prev"
          aria-disabled="true"
        >
          <a className="ant-pagination-item-link" />
        </li>
        {pageArr &&
          this.props.pageArr.map((item) => {
            return (
              <li
                title={item}
                className={`ant-pagination-item ant-pagination-item-${item} ant-pagination-item-active`}
                tabIndex="0"
                key={item}
              >
                <a>{item + 1}</a>
              </li>
            )
          })}
        <li
          title="Next Page"
          className="ant-pagination-disabled ant-pagination-next"
          aria-disabled="true"
        >
          <a className="ant-pagination-item-link" />
        </li>
      </ul>
    )
  }
}

export default CoinIndexPageNav
