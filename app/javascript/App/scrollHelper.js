// Workarounds for Firefox overflow bug - for more information, see:
// https://app.nuclino.com/CoinFi/Engineering/Handle-Firefox-Scrolling-Issues-724ec6e6-3d06-453b-b8fb-62582f796833

export default (element) => {
  const newsfeedElem = document.querySelector('#newsfeed')
  const newsBodyElem = document.querySelector('.selected-news-content')
  const coinDrawerElem = document.querySelector('.coin-watch-list')
  const coinListWrap = document.querySelector('.coin-list-wrap')
  const coinListDrawer = document.querySelector('.coin-list-drawer')

  const elemArr = [newsfeedElem, newsBodyElem, coinDrawerElem, element]

  const bodyTag = document.querySelector('body').offsetHeight
  const topNav = document.querySelector('.topnav').offsetHeight
  const coinSearchHeight = document.querySelector('.search-coin-wrapper')
    .offsetHeight

  // TODO: Figure out where this 30px is coming from...
  const calculatedNewsListHeight = bodyTag - topNav - coinSearchHeight - 30

  elemArr.forEach(function(ele) {
    if (ele && ele.style) ele.style.maxHeight = `${calculatedNewsListHeight}px`
  })

  if (!!newsfeedElem) {
    newsfeedElem.style.overflowY = `auto`
  }

  if (coinListWrap) coinListWrap.style.height = bodyTag + 'px'

  // TODO: figure out how to calculate the height because the percentage evaluates to different amts on chrome and ff
  // if (coinListDrawer) coinListDrawer.style.height = coinListWrap.offsetHeight + 'px'

  if (!!element) element.style.maxHeight = `${calculatedNewsListHeight}px`
}
