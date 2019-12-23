import * as React from 'react'
import NoSsr from '@material-ui/core/NoSsr'
import Url from 'url-parse'

const EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'nofollow noopener noreferrer',
}

/***
 * NOTE: We cannot use window on server side and it's not worth passing through the host,
 * so we use NoSsr to avoid mismatch issues during hydration
 */
export default function MarkupLink(props) {
  const { href, children } = props

  const linkUrl = new Url(href)
  const isExternalLink =
    typeof window !== 'undefined' && window.location.host !== linkUrl.host

  const linkProps = isExternalLink ? EXTERNAL_LINK_PROPS : {}

  return (
    <NoSsr>
      <a href={href} {...linkProps}>
        {children}
      </a>
    </NoSsr>
  )
}
