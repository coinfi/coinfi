/*
import 'regenerator-runtime/runtime'; // eslint-disable-line import/no-extraneous-dependencies

import * as React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

import { RailsContext } from 'types';
import { RailsProps } from 'listings-index/types';

import Layout from 'layout';
import routes from 'listings-index/routes';

import { initStore, sagaMiddleware, rootSaga } from './store';

const ListingsIndex = (props: RailsProps, context: RailsContext) => {
  const store = initStore(props, context);

  sagaMiddleware.run(rootSaga);

  return (
    <Provider store={store}>
      <StaticRouter location={context.location} context={{}}>
        <Layout navbar={props.navbar} alerts={props.alerts} impersonatedUser={props.impersonatedUser}>
          {routes}
        </Layout>
      </StaticRouter>
    </Provider>
  );
};

export default ExchangeListingsPage;
*/
