import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import CoinSummary from '../app/javascript/App/components/CoinSummary'

// import { bodySectionProps } from './bodySectionProps'

// import styles from './tachy.css'

storiesOf('Coin', module).add('summary', () => <CoinSummary />)

/*
storiesOf('News', module).add('body section', () => <BodySection bucket={bodySectionProps}  />);
storiesOf('News', module).add('news body', () => <NewsBody {bodySectionProps.bodyProps}  />);
storiesOf('News', module).add('news coin tags', () => <NewsBody {bodySectionProps.bodyProps}  />);
*/
