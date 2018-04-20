import components from '../../components/IcoFilters/filterComponents'

export const filterList = [
  {
    key: 'hardCap',
    label: 'Hard Cap',
    Component: components.HardCap,
    defaultValue: 1
  },
  {
    key: 'startDate',
    label: 'Start Date',
    Component: components.StartingDate,
    defaultValue: null
  },
  {
    key: 'closingDate',
    label: 'Closing Date',
    Component: components.ClosingDate,
    defaultValue: null
  },
  {
    key: 'openWhitelist',
    label: 'Open Whitelist',
    Component: components.OpenWhitelist,
    defaultValue: null
  },
  {
    key: 'reviewedBy',
    label: 'Reviewed By',
    Component: components.ReviewedBy,
    defaultValue: null
  },
  {
    key: 'category',
    label: 'Category',
    Component: components.Category,
    defaultValue: null
  },
  {
    key: 'socialCounts',
    label: 'Social Counts',
    Component: components.SocialCounts,
    defaultValue: null
  },
  {
    key: 'offered',
    label: '% Coins Offered',
    Component: components.PercentOffered,
    defaultValue: null
  },
  {
    key: 'tokenType',
    label: 'Token Type',
    Component: components.TokenType,
    defaultValue: null
  },
  {
    key: 'countries',
    label: 'Countries Allowed',
    Component: components.CountriesAllowed,
    defaultValue: null
  }
]

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
