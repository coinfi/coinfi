import React, { Component } from 'react'
import Type from 'prop-types'
import Input from '../../Input'

export default class HardCap extends Component {
  state = { min: 1, max: 100 }
  setVal = target => ({ target: { value } }) => {
    const s = { ...this.state }
    s[target] = value
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
  render() {
    const { min, max } = this.state
    return (
      <div className="oi-pane">
        <div className="oi-pane-content pa2">
          <div>Hard Cap</div>
          <div className="row">
            <div className="col-xs-6">
              <div className="f7">Min</div>
              <Input value={min} onChange={this.setVal('min')} />
            </div>
            <div className="col-xs-6">
              <div className="f7">Max</div>
              <Input value={max} onChange={this.setVal('max')} />
            </div>
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
