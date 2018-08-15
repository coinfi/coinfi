export default (element) => {
  // fixes issue in firefox where users are unable to scroll
  const newsfeedElem = document.querySelector('#newsfeed')
  const newsBodyElem = document.querySelector('.selected-news-content')
  const coinDrawerElem = document.querySelector('.coin-watch-list')
  const bodyTag = document.querySelector('body').offsetHeight
  const topNav = document.querySelector('.topnav').offsetHeight
  const coinSearchHeight = document.querySelector('.search-coin-wrapper').offsetHeight
  const calculatedNewsListHeight = bodyTag - topNav - coinSearchHeight

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
