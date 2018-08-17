import * as React from 'react';
import NewsfeedPage from './NewsfeedPage';
import CoinListContext from '../../contexts/CoinListContext'

interface Props {
  coinSlug?: string,
  newsItemId?: string,
};

const NewsfeedPageContainer = (props) => (
  <CoinListContext.Consumer>
    {
      (payload) => (
        <NewsfeedPage 
          coinSlug={props.coinSlug} 
          newsItemId={props.newsItemId} 
          coinList={payload.coinList}
        />
      )
    }
  </CoinListContext.Consumer>
);

export default NewsfeedPageContainer;
