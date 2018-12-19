import * as React from 'react'
import * as Currency from 'react-currency-formatter'

export default ({
  currency,
  children,
}: {
  children: string
  currency?: string
}) => {
  return <Currency currency={currency} quantity={parseFloat(children)} />
}
