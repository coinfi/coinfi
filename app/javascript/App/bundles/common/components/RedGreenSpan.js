import React from 'react'
import { aquaGreen, grapefruit } from '../styles/colors'

export default ({ text, prepend = '', affix = '' }) => {
  const display = `${prepend}${text}${affix}`
  if (text >= 0) {
    return <span style={{ color: aquaGreen }}>{display}</span>
  } else if (text < 0) {
    return <span style={{ color: grapefruit }}>{display}</span>
  } else {
    return <span>{display}</span>
  }
}
