import React from 'react'
import styled from 'styled-components'

class FlexGrid extends React.Component {
  render() {
    const FlexGrid = styled.div`
      display: block;
      flex-wrap: wrap;
      background: #f00;
      @media (min-width: 600px) {
        display: block;
      }
      @media (min-width: 900px) {
        display: block;
      }
    `
    return <FlexGrid>{this.props.children}</FlexGrid>
  }
}

export default FlexGrid
