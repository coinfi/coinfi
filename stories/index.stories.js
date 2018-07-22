import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import CoinSummary from '../app/javascript/App/components/CoinSummary'
import CoinDetail from '../app/javascript/App/components/CoinDetail'

// import { BodySection } from '../app/javascript/App/components/NewsfeedPage/BodySection'
// import { NewsBody } from '../app/javascript/App/components/NewsfeedPage/NewsBody'

// import { bodySectionProps } from './bodySectionProps'

// import styles from './tachy.css'

storiesOf('Coin', module).add('summary', () => <CoinSummary />)
storiesOf('Coin', module).add('detail', () => <CoinDetail />)

/*
storiesOf('News', module).add('body section', () => <BodySection bucket={bodySectionProps}  />);
storiesOf('News', module).add('news body', () => <NewsBody {bodySectionProps.bodyProps}  />);
storiesOf('News', module).add('news coin tags', () => <NewsBody {bodySectionProps.bodyProps}  />);
*/
