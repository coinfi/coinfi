import { fromJS } from 'immutable'

export const filterList = fromJS([
  {
    key: 'hardCap',
    label: 'Hard Cap',
    defaultValue: { min: 1, max: 100 }
  },
  {
    key: 'startingDate',
    label: 'Starting Date'
  },
  {
    key: 'closingDate',
    label: 'Closing Date'
  },
  {
    key: 'openWhitelist',
    label: 'Open Whitelist',
    defaultValue: true
  },
  {
    key: 'reviewedBy',
    label: 'Reviewed By'
  },
  {
    key: 'categories',
    label: 'Categories'
  },
  {
    key: 'socialCounts',
    label: 'Social Counts'
  },
  {
    key: 'percentOffered',
    label: '% Coins Offered'
  },
  {
    key: 'tokenType',
    label: 'Token Type'
  },
  {
    key: 'countries',
    label: 'Countries Allowed'
  }
])

export const categories = [
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
]
