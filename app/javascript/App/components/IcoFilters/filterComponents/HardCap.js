import React, { Component } from 'react'
import Type from 'prop-types'
import Input from '../../Input'
import { Range } from 'rc-slider'

const defaults = { min: 1, max: 100 }

export default class HardCap extends Component {
  state = { min: defaults.min, max: defaults.max }
  setVal = target => ({ target: { value } }) => {
    const s = { ...this.state }
    s[target] = parseInt(value, 10)
    this.setState(s)
  }
  componentDidMount() {
    const { value } = this.props
    if (!value) return
    this.setState(value)
  }
  applyFilter = () => {
    const { setFilter, toggleUI } = this.props
    const { min, max } = this.state
    setFilter('hardCap', { min, max })
    toggleUI('newFilter')
  }
  onSlide = ([min, max]) => {
    this.setState({ min, max })
  }
  render() {
    const { min, max } = this.state
    return (
      <div className="oi-pane">
        <div className="oi-pane-content pa3">
          <div>Hard Cap</div>
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
          <div className="right-align">
            <button className="btn btn-xs" onClick={() => this.applyFilter()}>
              Apply
            </button>
          </div>
        </div>
      </div>
    )
  }
}

HardCap.propTypes = {
  value: Type.object, // { min: 1, max: 100 }
  setFilter: Type.func
}
