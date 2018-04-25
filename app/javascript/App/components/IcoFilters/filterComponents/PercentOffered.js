import React, { Component } from 'react'
import Icon from '../../Icon'
import Input from '../../Input'
import Slider from 'rc-slider'

export default class PercentOffered extends Component {
  render() {
    const { value, onChange } = this.props
    return (
      <div className="pa3">
        <div className="icon-input">
          <Input type="number" value={value || 0} onChange={onChange} />
          <Icon name="percent" />
        </div>
        <Slider
          value={parseInt(value || 0, 10)}
          min={0}
          max={100}
          onChange={onChange}
        />
      </div>
    )
  }
}
