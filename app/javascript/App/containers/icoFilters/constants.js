import { fromJS } from 'immutable'

export const filterList = fromJS([
  {
    key: 'coinIndustries',
    label: 'Categories'
  },
  {
    key: 'closingDate',
    label: 'Closing Date'
  },
  {
    key: 'countriesAllowed',
    label: 'Countries Allowed',
    disabled: true
  },
  {
    key: 'hardCap',
    label: 'Hard Cap',
    defaultValue: { min: 1, max: 100 }
  },
  {
    key: 'openWhitelist',
    label: 'Open Whitelist',
    defaultValue: true,
    disabled: true
  },
  {
    key: 'percentOffered',
    label: 'Percent Offered',
    disabled: true
  },
  {
    key: 'reviewedBy',
    label: 'Reviewed By',
    disabled: true
  },
  {
    key: 'socialCounts',
    label: 'Social Counts',
    defaultValue: { twitter: 0, telegram: 0 },
    disabled: true
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
  countries: ['China', 'United States', 'Canada', 'South Korea']
}
