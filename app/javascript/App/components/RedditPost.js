import React from 'react'

export default props => {
  const url = `https://www.reddit.com/${props.permalink}`
  return (
    <a href={url} target="_blank" className="db pv4 bb b--light-gray">
      {props.title}
    </a>
  )
}
