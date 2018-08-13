import * as React from 'react'
//import { Provider } from 'react-redux'
//import { Router } from 'react-router-dom';
//import { stringify, parse as parseQueryString } from 'qs'
//import createBrowserHistory from 'history/createBrowserHistory'; // eslint-disable-line import/no-extraneous-dependencies

import LayoutDesktop from './components/LayoutDesktop'
//import routes from 'listings-index/routes';

//import { initStore, sagaMiddleware, rootSaga } from './store'

//const stringifyQuery = (query) => stringify(query, { arrayFormat: 'brackets' })

const ExchangeListingsPage = (props, context) => {
  //const store = initStore(props, context)

  //sagaMiddleware.run(rootSaga)

  //console.log(props)
  return <LayoutDesktop {...props} />
}

export default ExchangeListingsPage
