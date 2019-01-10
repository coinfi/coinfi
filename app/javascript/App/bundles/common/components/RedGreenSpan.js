import React from 'react'
export default ({ text, prepend = '', affix = '' }) => {
  const display = `${prepend}${text}${affix}`
  if (text >= 0) {
    return <span style={{ color: '#12d8b8' }}>{display}</span>
  } else if (text < 0) {
    return <span style={{ color: '#ff6161' }}>{display}</span>
  } else {
    return <span>{display}</span>
  }
}
