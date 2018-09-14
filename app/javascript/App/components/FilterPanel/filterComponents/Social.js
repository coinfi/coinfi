import React, { Fragment } from 'react'
import Type from 'prop-types'
import ToggleReddit from './ToggleReddit'
import ToggleTwitter from './ToggleTwitter'

const Social = (props) => {
  const { onChange, value } = props

  return (
    <Fragment>
      <div className="pv2 f6">
        {`If a coin does not have a lot of news coverage from our general sources, we'll automatically enable social sources for the coin.`}
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
