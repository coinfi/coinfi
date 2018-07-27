import React from 'react'
import SparkLine from './SparkLine.jsx'



class SparkLineTable extends React.Component {
  constructor(props) {
    super(props)
  }

  toSparkLine(children, params) {
   let header

    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) return child

      if (child.type === 'th') header = child.props.children

      if (child.props['data-sparkline']) {
        return this.sparkLine(child, header)
      }

      if (child.props.children) {
        child = React.cloneElement(child, {
          children: this.toSparkLine(child.props.children)
        })
      }

      return child
    })
  }

  sparkLine(element, header) {
    const dataAttr = element.props['data-sparkline'].split('; ')

    const data = dataAttr[0].split(', ').map(Number)
    const options = {
      series: [{
        data,
        pointStart: 1
      }],

      tooltip: {
        headerFormat: `<span style="font-sze:10px">${header}, Q{point.x}: </span><br/>`,
        pointFormat: '<b>{point.y}.000</b> USD'
      },
      chart: {
        type: dataAttr[1] || 'area'
      }
    }

    return <SparkLine options={options} />
  }

  render () {
    const style = {
      margin: '0 auto',
      borderCollapse: 'collapse'
    }

    return (
      <table style={style}>
        {this.toSparkLine(this.props.children)}
      </table>
    )
  }
}

export default SparkLineTable
