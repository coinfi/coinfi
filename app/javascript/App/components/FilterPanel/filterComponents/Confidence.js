import React, { Component, Fragment } from 'react'
import Type from 'prop-types'
import { Slider } from 'antd'

const key = 'confidence'

export default class Confidence extends Component {
  constructor(props) {
    super(props)
    this.state = {
      [key]: this.selectedItems()[key] || [0, 100],
    }
  }

  onChange = (item) => this.props.onChange(key)(item)
  selectedItems = () => this.props.value
  select = (item) => {
    console.log(item)
    this.onChange(item)
  }
  update = (item) => {
    this.setState({
      ...this.state,
      [key]: item,
    })
  }
  itemLabel = (item) => {
    if (item instanceof Object) {
      return item.name || item.title || item.label
    }
    return item
  }

  render() {
    return (
      <div className="item-slider-alt">
        <div className="pv4">
          {this.state[key][0]} {this.state[key][1]}
          <Slider
            range
            tipFormatter={null}
            defaultValue={this.state.confidence}
            onChange={this.update.bind(this)}
            onAfterChange={this.select.bind(this)}
          />
        </div>
      </div>
    )
  }
}

Confidence.propTypes = {
  value: Type.object,
  onChange: Type.func,
}
