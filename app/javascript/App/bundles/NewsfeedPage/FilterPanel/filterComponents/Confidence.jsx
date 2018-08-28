import * as React from 'react'
import { Slider } from 'antd'

const key = 'confidence'

// interface IProps {
//   value: any
//   onChange: (a: any) => (b: any) => void
// }

export default class Confidence extends React.Component<IProps, {}> {
  constructor(props) {
    super(props)
    this.state = {
      [key]: this.selectedItems()[key] || [0, 100],
    }
  }

  onChange = (item) => this.props.onChange(key)(item)
  selectedItems = () => this.props.value
  select = (item) => {
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
            range={true}
            tipFormatter={null}
            defaultValue={this.state.confidence}
            onChange={this.update}
            onAfterChange={this.select}
          />
        </div>
      </div>
    )
  }
}
