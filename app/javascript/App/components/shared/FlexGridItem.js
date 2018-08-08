import React from 'react'
import styled from 'styled-components'

class FlexGridItemElem extends React.Component {
  render() {
    const flexBasisWidth = 300
    const colGridWidth = this.props.colWidth == 2 ? '67%' : '50%'
    if (this.props.component == 'chart') {
      const FlexGridItem = styled.div`
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        @media (min-width: 600px) {
          flex-grow: 0;
        }
        @media (min-width: 900px) {
          float: left;
          width: 66%;
          margin-left:.5rem;
        }
      `
      return <FlexGridItem>{this.props.children}</FlexGridItem>
    }
    const FlexGridItem = styled.div`
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      @media (min-width: 600px) {
        flex-grow: 0;
      }
      @media (min-width: 900px) {
        flex-basis: ${colGridWidth};
        align-self: flex-start;
        float: right;
        width: 33%;
      }
    `
    return <FlexGridItem>{this.props.children}</FlexGridItem>
  }
}

export default FlexGridItemElem
