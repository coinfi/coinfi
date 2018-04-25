import React, { Component } from 'react'
import Input from '../../Input'
export default class StartingDate extends Component {
  handleChange = value => {
    console.log(value)
  }
  render() {
    return (
      <div className="pa3">
        <header>Starting date</header>
        <Input type="date" />
      </div>
    )
  }
}
