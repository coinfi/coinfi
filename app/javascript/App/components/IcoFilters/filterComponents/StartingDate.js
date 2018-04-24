import React, { Component } from 'react'
import { DatePicker } from 'element-react'
export default class StartingDate extends Component {
  handleChange = value => {
    console.log(value)
  }
  render() {
    return (
      <div className="pa3">
        <header>Starting date</header>
        <DatePicker selectionMode="month" onChange={this.handleChange} />
      </div>
    )
  }
}
