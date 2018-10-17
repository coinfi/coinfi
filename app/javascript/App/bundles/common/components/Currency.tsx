import * as React from 'react'
import * as Currency from 'react-currency-formatter'

export default ({ children }: { children: string }) => {
  return <Currency quantity={parseFloat(children)} />
}
