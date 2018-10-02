import URL from 'url-parse'

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

export const isTwitter = (url: string): boolean => {
  const parsedUrl = new URL(url)
  return parsedUrl.hostname === 'twitter.com'
}

export const isReddit = (url: string): boolean => {
  const parsedUrl = new URL(url)
  return parsedUrl.hostname === 'reddit.com'
}

export const getTwitterUsername = (url: string): string => {
  const re = /^(https?:\/\/)?[^/ ]*twitter\.com\/([^/ ?]+)\/?/
  const match = re.exec(url)
  if (!match) {
    return
  }

  return match[2]
}

export const getSubredditName = (url: string): string => {
  const re = /^(https?:\/\/)?[^/ ]*reddit\.com\/r\/([^/ ?]+)\/?/
  const match = re.exec(url)
  if (!match) {
    return
  }

  return match[2]
}
