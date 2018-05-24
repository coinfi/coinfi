import qs from 'qs'

export const getQueryObject = () => {
  const search = window.location.search
  if (search) return qs.parse(search.substr(1))
  return {}
}

export const currentURL = ({ withQuery, queryObject }) => {
  let href = window.location.href
  if (queryObject) {
    const queryString = qs.stringify(queryObject, { encode: false })
    href = href.split('?')[0]
    return `${href}?${queryString}`
  } else {
    return withQuery ? href : href.split('?')[0]
  }
}

export const stringHostname = (string) => {
  const { hostname } = new URL(string)
  const parts = hostname.split('.')
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
}

export const pushObjectToURL = (object) => {
  const queryString = qs.stringify(object, { encode: false })
  window.history.pushState(object, document.title, `?${queryString}`)
}
