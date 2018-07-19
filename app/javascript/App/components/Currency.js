import React from 'react'
import Currency from 'react-currency-formatter'

export default ({children}) => {
  return <Currency quantity={parseFloat(children)} />
}
