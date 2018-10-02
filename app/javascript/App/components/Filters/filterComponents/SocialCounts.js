import React, { Component } from 'react'
import Type from 'prop-types'
import Input from '../../Input'
import Icon from '../../../bundles/common/components/Icon'
import Slider from 'rc-slider'

const scale = { min: 0, max: 1000, step: 50 }

const SocialCounts = (props) => (
  <div className="pa3 pt0">
    <SocialCount network="twitter" {...props} />
    <SocialCount network="telegram" {...props} className="mt3" />
  </div>
)

SocialCounts.propTypes = {
  value: Type.object.isRequired,
}

export default SocialCounts
class SocialCount extends Component {
  setVal = (network) => (value) => {
    const { onChange, value: v } = this.props
    v[network] = value
    onChange(v)
  }
  render() {
    const { value, network, className } = this.props
    return (
      <div className={className || ''}>
        <div className="flex justify-between items-center mb2">
          <div className="f6 elephant ttc mr3 flex-none">
            <Icon brand name={network} className="mr2 aqua" />
            {network}
          </div>
          <Input
            onChange={this.setVal(network)}
            type="number"
            value={value[network]}
            {...scale}
            className="small"
          />
        </div>
        <Slider
          onChange={this.setVal(network)}
          value={parseInt(value[network], 10)}
          {...scale}
        />
      </div>
    )
  }
}
