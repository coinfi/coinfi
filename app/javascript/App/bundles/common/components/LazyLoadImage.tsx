import * as React from 'react'
import LazyLoad from 'react-lazyload'
export { forceCheck as forceLazyLoadCheck } from 'react-lazyload'

export default function LazyLoadImage(props) {
  const { containerProps = {}, ...imgProps } = props
  const { offset = 100 } = containerProps

  return (
    <LazyLoad offset={offset} once={true} {...containerProps}>
      <img {...imgProps} />
    </LazyLoad>
  )
}
