export default (element) => {
  // Workarounds for Firefox overflow bug - for more information, see:
  // https://app.nuclino.com/CoinFi/Engineering/Handle-Firefox-Scrolling-Issues-724ec6e6-3d06-453b-b8fb-62582f796833
  const newsfeedElem = document.querySelector('#newsfeed')
  const newsBodyElem = document.querySelector('.selected-news-content')
  const coinDrawerElem = document.querySelector('.coin-watch-list')
  const bodyTag = document.querySelector('body').offsetHeight
  const topNav = document.querySelector('.topnav').offsetHeight
  const coinSearchHeight = document.querySelector('.search-coin-wrapper')
    .offsetHeight
  // TODO: Figure out where this 30px is coming from...
  const calculatedNewsListHeight = bodyTag - topNav - coinSearchHeight - 30
  console.log(calculatedNewsListHeight)

  if (!!newsfeedElem) {
    newsfeedElem.style.maxHeight = `${calculatedNewsListHeight}px`
    newsfeedElem.style.overflowY = `auto`
  }

  if (!!newsBodyElem)
    newsBodyElem.style.maxHeight = `${calculatedNewsListHeight}px`

  if (!!coinDrawerElem)
    coinDrawerElem.style.maxHeight = `${calculatedNewsListHeight}px`

  if (!!element) element.style.maxHeight = `${calculatedNewsListHeight}px`
}
