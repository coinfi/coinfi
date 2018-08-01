import React from 'react'
import styled from 'styled-components'

const FlexGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (min-width: 900px) {
    display: block;
    width: 100%;
  }
`

export default FlexGrid
