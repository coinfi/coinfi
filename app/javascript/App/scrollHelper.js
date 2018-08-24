export default () => {
  // Workarounds for Firefox overflow bug - for more information, see:
  // https://app.nuclino.com/CoinFi/Engineering/Handle-Firefox-Scrolling-Issues-724ec6e6-3d06-453b-b8fb-62582f796833

  const panelHeader = document.querySelector('#panel-header')
  if (panelHeader) {
    const newsfeedElem = document.querySelector('#newsfeed')
    const newsBodyElem = document.querySelector('.selected-news-content')
    const coinDrawerElem = document.querySelector('.coin-watch-list')
    const topNavHeight = document.querySelector('.topnav').offsetHeight
    const filterTagWrap = document.querySelector('.filter-tag-wrap')
    const windowHeight = window.innerHeight
    const panelHeaderHeight = panelHeader.offsetHeight

    const calculatedHeight = windowHeight - topNavHeight - panelHeaderHeight
    if (!!newsfeedElem) {
      newsfeedElem.style.maxHeight = `${calculatedHeight}px`
      if (filterTagWrap !== null) {
        // TODO: get this to work, because this elem doesnt exist
        newsfeedElem.style.maxHeight = `${calculatedHeight +
          filterTagWrap.offsetHeight -
          128}px`
      }
      newsfeedElem.style.overflowY = `auto`
    }

    if (!!newsBodyElem) {
      newsBodyElem.style.maxHeight = `${calculatedHeight - 32}px` // magic number for padding
    }

    if (!!coinDrawerElem) {
      coinDrawerElem.style.maxHeight = `${calculatedHeight}px`
    }
  }
}
