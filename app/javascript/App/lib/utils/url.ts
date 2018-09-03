const urlRegex = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?((?:\/[~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?$/

const domainName = (url: string) => {
  if (!url.match(urlRegex)) {
    return null
  }
  const domains = urlRegex.exec(url)[1].split('.')
  return domains[domains.length - 1]
}

export type DomainType = 'twitter' | 'reddit' | 'default'

export const getDomainType = (url: string): DomainType => {
  const domain = domainName(url)

  if (domain && (domain === 'twitter' || domain === 'reddit')) {
    return domain
  }

  return 'default'
}

export const getTweetId = (url: string): string => {
  if (getDomainType(url) === 'twitter') {
    const fragments = url.split('/')
    return fragments[fragments.length - 1]
  }

  return null
}
