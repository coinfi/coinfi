export default () => {
  // Workarounds for Firefox overflow bug - for more information, see:
  // https://app.nuclino.com/CoinFi/Engineering/Handle-Firefox-Scrolling-Issues-724ec6e6-3d06-453b-b8fb-62582f796833

  const panelHeader = document.querySelector('#panel-header')
  const topNavHeight = document.querySelector('.nav').offsetHeight

  if (panelHeader && window.isMobile) {
    const newsfeedElem = document.querySelector('#newsfeed')

    if (!!newsfeedElem) {
      const coinTipsTab = document.querySelector('#coin-tips-tab')
      const calculatedHeight =
        window.innerHeight -
        panelHeader.offsetHeight -
        coinTipsTab.offsetHeight -
        topNavHeight
      newsfeedElem.style.maxHeight = `${calculatedHeight}px`
    }
  }

  if (panelHeader && window.isTablet) {
    const newsfeedElem = document.querySelector('#newsfeed')

    if (!!newsfeedElem) {
      const newsBodyElem = document.querySelector('.selected-news-content')
      const coinDrawerElem = document.querySelector('.coin-watch-list')
      const windowHeight = window.innerHeight
      const panelHeaderHeight = panelHeader.offsetHeight

      const calculatedHeight =
        windowHeight - topNavHeight - panelHeaderHeight - topNavHeight

      if (!!newsfeedElem) {
        newsfeedElem.style.maxHeight = `${calculatedHeight}px`
      }

      if (!!newsBodyElem) {
        newsBodyElem.style.maxHeight = `${calculatedHeight}px`
      }

      if (!!coinDrawerElem) {
        coinDrawerElem.style.maxHeight = `${calculatedHeight}px`
      }
    }
  }

  if (panelHeader && window.isDesktop) {
    const newsfeedElem = document.querySelector('#newsfeed')
    const newsBodyElem = document.querySelector('.selected-news-content')
    const coinDrawerElem = document.querySelector('.coin-watch-list')
    const windowHeight = window.innerHeight
    const panelHeaderHeight = panelHeader.offsetHeight

    const calculatedHeight = windowHeight - topNavHeight - panelHeaderHeight

    if (!!newsfeedElem) {
      newsfeedElem.style.maxHeight = `${calculatedHeight}px`
    }

    if (!!newsBodyElem) {
      newsBodyElem.style.maxHeight = `${calculatedHeight + topNavHeight}px`
    }

    if (!!coinDrawerElem) {
      coinDrawerElem.style.maxHeight = `${calculatedHeight}px`
    }
  }
}
