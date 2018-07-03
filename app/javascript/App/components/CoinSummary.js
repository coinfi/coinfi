import React from "react"
import styled from 'styled-components'

const Button = styled.button`
background: palevioletred;
border-radius: 3px;
border: none;
color: white;
`;

const TomatoButton = styled(Button)`
background: tomato;
`;

export default props => {
  return <Button text={'test'}>foo</Button>
}

