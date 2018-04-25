import React, { Component } from 'react'
import Type from 'prop-types'
import Input from '../../Input'
import { Range } from 'rc-slider'

const defaults = { min: 1, max: 100 }

export default class HardCap extends Component {
  componentDidMount() {
    this.props.onChange(this.value())
  }
  value = () => this.props.value || defaults
  setVal = name => value => {
    const s = this.value()
    s[name] = parseInt(value, 10)
    this.props.onChange(s)
  }
  onSlide = ([min, max]) => this.props.onChange({ min, max })
  render() {
    const { min, max } = this.value()
    return (
      <div className="pa3">
        <div className="row">
          <div className="col-xs-6">
            <div className="f7">Min</div>
            <Input
              type="number"
              value={min}
              min={defaults.min}
              max={defaults.max}
              onChange={this.setVal('min')}
            />
          </div>
          <div className="col-xs-6">
            <div className="f7">Max</div>
            <Input
              type="number"
              value={max}
              min={defaults.min}
              max={defaults.max}
              onChange={this.setVal('max')}
            />
          </div>
        </div>
        <div className="ph1 pt2">
          <Range
            min={defaults.min}
            max={defaults.max}
            value={[min, max]}
            onChange={this.onSlide}
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
