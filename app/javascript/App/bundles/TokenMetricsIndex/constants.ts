export const TABS: TokenMetricsTabData[] = [
  {
    slug: 'supply-on-exchange',
    label: 'Supply On Exchanges',
    description:
      'A high percentage of supply on exchanges could indicate higher intention to sell by holders.',
    columnName: 'Supply on Exchanges',
    type: 'percentage',
  },
  {
    slug: 'retention',
    label: 'Retention',
    description:
      'A high percentage of early investors still HODLing could indicate strong belief in project.',
    columnName: '% of Early Investors Still HODLing',
    type: 'percentage',
  },
  {
    slug: 'decentralization',
    label: 'Decentralization',
    description:
      'A high percentage held by whales could indicate higher vulnerability to price manipulation.',
    columnName: '% Held by Top 100 Wallets',
    type: 'percentage',
  },
  {
    slug: 'adoption',
    label: 'Adoption',
    description:
      'More unique wallets HODLing could indicate more adoption by users.',
    columnName: 'Unique Wallets HODLing Token',
    type: 'number',
  },
  {
    slug: 'velocity',
    label: 'Velocity',
    description:
      'A high percentage of the supply transacted on the blockchain could indicate strong adoption or usage of the token.',
    columnName: '% of Supply Transacted on Blockchain',
    type: 'percentage',
  },
]

export const orderByDefaults = {
  orderBy: 'market_cap',
  order: 'desc' as ORDERS,
}
