import React, { Fragment } from 'react'
import Type from 'prop-types'
import ToggleReddit from './ToggleReddit'
import ToggleTwitter from './ToggleTwitter'

const Social = (props) => {
  const { onChange, value } = props

  return (
    <Fragment>
      <div className="pv2 f6">
        Reddit and Twitter often has more noise than signal so we&apos;ve
        disabled them by default, but you can enable them here.
      </div>
      <ToggleReddit
        {...props}
        selectedItems={value}
        onChange={onChange('feedSources')}
      />
      <ToggleTwitter
        {...props}
        selectedItems={value}
        onChange={onChange('feedSources')}
      />
    </Fragment>
  )
}

Social.propTypes = {
  value: Type.object,
  onChange: Type.func,
}

export default Social
