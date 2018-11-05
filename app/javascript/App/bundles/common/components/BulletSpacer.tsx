import * as React from 'react'
import { CSSProperties } from 'react'

interface Props {
  fontSize?: number
  styles?: CSSProperties
}

const BulletSpacer = ({ fontSize, styles }: Props) => {
  fontSize = fontSize !== undefined ? fontSize : 8

  return (
    <span className="ph2 v-mid" style={{ ...styles, fontSize }}>
      &bull;
    </span>
  )
}

export default BulletSpacer
