import React, { Component } from 'react'
import Type from 'prop-types'
import Input from '../../Input'
import { Range } from 'rc-slider'

const scale = { min: 1, max: 100 }

export default class HardCap extends Component {
  setVal = name => value => {
    const { value: v, onChange } = this.props
    v[name] = parseInt(value, 10)
    onChange(v)
  }
  onSlide = ([min, max]) => this.props.onChange({ min, max })
  render() {
    const { value } = this.props
    return (
      <div className="pa3">
        <div className="row">
          <div className="col-xs-6">
            <div className="f7">Min</div>
            <Input
              type="number"
              value={value.min}
              onChange={this.setVal('min')}
              {...scale}
            />
          </div>
          <div className="col-xs-6">
            <div className="f7">Max</div>
            <Input
              type="number"
              value={value.max}
              onChange={this.setVal('max')}
              {...scale}
            />
          </div>
        </div>
        <div className="ph1 pt2">
          <Range
            value={[value.min, value.max]}
            onChange={this.onSlide}
            {...scale}
          />
        </div>
      </div>
    )
  }
}

HardCap.propTypes = {
  value: Type.object, // { min: 1, max: 100 }
  setFilter: Type.func
}
