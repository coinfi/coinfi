import React from 'react'
import styled from 'styled-components'

class FlexGridItemElem extends React.Component {
  render() {
    const flexBasisWidth = 300
    const colGridWidth = this.props.colWidth * flexBasisWidth || flexBasisWidth
    const FlexGridItem = styled.div`
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 33.3333%;
      flex-basis: ${flexBasisWidth}px;
      display: flex;
      align-items: center;
      justify-content: center;
      @media (min-width: 600px) {
        flex-basis: ${flexBasisWidth}px;
      }
      @media (min-width: 900px) {
        flex-basis: ${colGridWidth}px;
      }
    `
    return <FlexGridItem>{this.props.children}</FlexGridItem>
  }
}

export default FlexGridItemElem
