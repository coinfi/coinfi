import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import CoinSummary from '../app/javascript/App/components/CoinSummary'
import CoinDetail from '../app/javascript/App/components/CoinDetail'


storiesOf('Coin', module).add('summary', () => <CoinSummary  />);

storiesOf('Coin', module).add('detail', () => <CoinDetail  />);

