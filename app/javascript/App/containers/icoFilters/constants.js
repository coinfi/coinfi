import { fromJS } from 'immutable'

export const filterList = fromJS([
  {
    key: 'categories',
    label: 'Categories'
  },
  {
    key: 'closingDate',
    label: 'Closing Date'
  },
  {
    key: 'countriesAllowed',
    label: 'Countries Allowed'
  },
  {
    key: 'hardCap',
    label: 'Hard Cap',
    defaultValue: { min: 1, max: 100 }
  },
  {
    key: 'openWhitelist',
    label: 'Open Whitelist',
    defaultValue: true
  },
  {
    key: 'percentOffered',
    label: 'Percent Offered'
  },
  {
    key: 'reviewedBy',
    label: 'Reviewed By'
  },
  {
    key: 'socialCounts',
    label: 'Social Counts',
    defaultValue: { twitter: 0, telegram: 0 }
  },
  {
    key: 'startingDate',
    label: 'Starting Date'
  },
  {
    key: 'tokenType',
    label: 'Token Type'
  }
])

export const filterData = {
  categories: [
    'Advertising & Marketing',
    'Artificial Intelligence',
    'Banking',
    'Blockchain',
    'Blockchain tools',
    'Cloud Storage',
    'Crowdfunding',
    'CryptoFund',
    'Currency',
    'Data',
    'Energy',
    'Exchange',
    'Finance',
    'Gambling',
    'Gaming',
    'Healthcare',
    'Insurance',
    'Identity',
    'IOT',
    'Logistics',
    'Marketplace',
    'Media',
    'Mining',
    'Mobile',
    'Network',
    'Payments',
    'Protocol',
    'Real Assets',
    'Real Business',
    'Real Estate',
    'Security',
    'Social',
    'Ticketing',
    'Trading',
    'Virtual Reality',
    'Voting'
  ],
  countries: ['China', 'United States', 'Canada', 'South Korea']
}
