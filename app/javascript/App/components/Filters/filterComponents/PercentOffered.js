import React, { Component } from 'react'
import Icon from '../../../bundles/common/components/Icon'
import Input from '../../Input'
import Slider from 'rc-slider'

const scale = { min: 1, max: 100 }
export default class PercentOffered extends Component {
  render() {
    const { onChange } = this.props
    const value = this.props.value || scale.min
    return (
      <div className="pa3 pt0">
        <div className="flex items-center mb2">
          <Input
            type="number"
            className="small mr2"
            value={value}
            onChange={onChange}
            style={{ width: '60px' }}
            {...scale}
          />
          <Icon name="percent" />
        </div>
        <Slider value={parseInt(value, 10)} onChange={onChange} {...scale} />
      </div>
    )
  }
}
