import {
  getTwitterUsername,
  getSubredditName,
  isTwitter,
  isReddit,
} from '~/bundles/common/utils/url'
import URL from 'url-parse'

export function formatNewsUrl(url) {
  const parsedUrl = new URL(url)
  const linkUrl = isTwitter(url)
    ? `https://twitter.com/${parsedUrl.pathname.split('/')[1]}`
    : url
  const linkText = isTwitter(url)
    ? `@${getTwitterUsername(url)}`
    : isReddit(url)
      ? `/r/${getSubredditName(url)}`
      : parsedUrl.hostname

  return {
    linkUrl,
    linkText,
  }
}
