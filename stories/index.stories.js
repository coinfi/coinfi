import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import CoinSummary from '../app/javascript/App/components/CoinSummary'
import CoinDetail from '../app/javascript/App/components/CoinDetail'
import { BodySection } from '../app/javascript/App/components/NewsfeedPage/BodySection'

import { bodySectionProps } from './bodySectionProps'


storiesOf('Coin', module).add('summary', () => <CoinSummary  />);

storiesOf('Coin', module).add('detail', () => <CoinDetail  />);

storiesOf('Coin', module).add('body section', () => <BodySection bucket={bodySectionProps}  />);
