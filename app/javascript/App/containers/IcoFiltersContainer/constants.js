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
    label: 'countriesAllowed',
    Component: components.CountriesAllowed,
    defaultValue: null
  }
]
