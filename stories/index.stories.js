import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


import { CoinSummary } from './CoinSummary'


storiesOf('Coin Summary', module).add('to Storybook', () => <CoinSummary name={'test'} />);

