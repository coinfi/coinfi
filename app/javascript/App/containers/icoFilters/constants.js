import {fromJS} from 'immutable'

export const namespace = 'icoFilters'

export const filterList = fromJS([
  {
    key: 'search',
    label: 'Search',
    unlisted: true,
  },
  {
    key: 'coinIndustries',
    label: 'Categories',
  },
  {
    key: 'closingDate',
    label: 'Closing Date',
  },
  {
    key: 'hardCap',
    label: 'Hard Cap',
    defaultValue: {min: 1, max: 100},
  },
  {
    key: 'startingDate',
    label: 'Starting Date',
  },
  {
    key: 'tokenType',
    label: 'Token Type',
  },
  {
    key: 'countriesAllowed',
    label: 'Countries Allowed',
    disabled: true,
  },
  {
    key: 'openWhitelist',
    label: 'Open Whitelist',
    defaultValue: true,
    disabled: true,
  },
  {
    key: 'percentOffered',
    label: 'Percent Offered',
    disabled: true,
  },
  {
    key: 'reviewedBy',
    label: 'Reviewed By',
  },
  {
    key: 'socialCounts',
    label: 'Social Counts',
    defaultValue: {twitter: 0, telegram: 0},
    disabled: true,
  },
])

export const filterData = {
  countries: ['China', 'United States', 'Canada', 'South Korea'],
}
