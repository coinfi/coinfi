import React from 'react'

export default class CoinIndexPageNav extends React.Component {
  selectedPage() {
    console.log(window.location.search)
  }
  render() {
    this.selectedPage()
    return (
      <div className="pagination">
        <div className="pb3 f6 gray">100 of 1674 results</div>
        <ul>
          <li>
            <a href="/coinsnew">« First</a>
          </li>
          <li>
            <a rel="prev" href="/">
              ‹ Prev
            </a>
          </li>
          <li>
            <a href="/coinsnew">1</a>
          </li>
          <li>
            <a href="/coinsnew?page=2">2</a>
          </li>
          <li>
            <a href="/coinsnew?page=3">3</a>
          </li>
          <li>
            <a href="/coinsnew?page=4">4</a>
          </li>
          <li>
            <a href="/coinsnew?page=5">5</a>
          </li>
          <li>
            <a rel="prev" href="/coinsnew?page=6">
              6
            </a>
          </li>
          <li>
            <a href="#">7</a>
          </li>
          <li>
            <a rel="next" href="/coinsnew?page=8">
              8
            </a>
          </li>
          <li>
            <a href="/coinsnew?page=9">9</a>
          </li>
          <li>
            <a href="/coinsnew?page=10">10</a>
          </li>
          <li>
            <a href="/coinsnew?page=11">11</a>
          </li>
          <li>
            <a href="/coinsnew?page=12">12</a>
          </li>
          <li>
            <a href="/coinsnew?page=13">13</a>
          </li>
          <li className="disabled">
            <a href="#">…</a>
          </li>
          <li>
            <a rel="next" href="/coinsnew?page=8">
              Next ›
            </a>
          </li>
          <li>
            <a href="/coinsnew?page=17">Last »</a>
          </li>
        </ul>
      </div>
    )
  }
}
