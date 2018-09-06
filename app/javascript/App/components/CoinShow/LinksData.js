export default (coinObj, currency) => [
  {
    linkType: 'Website',
    value: coinObj.website,
    icon: 'link',
  },
  {
    linkType: 'Whitepaper',
    value: coinObj.whitepaper,
    icon: 'file-alt',
  },
  {
    linkType: 'Explorer',
    value: coinObj.explorer,
    icon: 'search',
  },
  {
    linkType: 'Twitter',
    value: coinObj.twitter,
    icon: 'twitter',
    brand: true,
  },
  {
    linkType: 'Reddit',
    value: coinObj.reddit,
    icon: 'reddit',
    brand: true,
  },
  {
    linkType: 'Medium',
    value: coinObj.medium,
    icon: 'medium',
    brand: true,
  },
  {
    linkType: 'Github',
    value: coinObj.github,
    icon: 'github',
    brand: true,
  },
  {
    linkType: 'Telegram',
    value: coinObj.telegram,
    icon: 'telegram',
    brand: true,
  },
]
