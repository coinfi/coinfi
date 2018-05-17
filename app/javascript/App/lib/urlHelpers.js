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
