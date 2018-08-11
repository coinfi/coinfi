export default (coinObj, currency) => {
  return [
    {
      linkType: 'Website',
      value: coinObj.website,
      icon: 'link',
    },
    {
      linkType: 'Whitepaper',
      value: coinObj.whitepaper,
      icon: 'file-text',
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
    },
    {
      linkType: 'Github',
      value: coinObj.github,
      icon: 'github',
    },
  ]
}
