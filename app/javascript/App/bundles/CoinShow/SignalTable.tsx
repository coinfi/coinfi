import * as React from 'react'
import * as moment from 'moment'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core'
import {
  formatValue,
  formatAbbreviatedPrice,
} from '~/bundles/common/utils/numberFormatters'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'

interface Props {
  signals: SummarySignal[]
  symbol: string
}

interface SummarySignal {
  timestamp: string
  raw_value: number
  value: number
  price: number
  to_address_name: string
  from_address_name: string
  transaction_hash: string
}

export default function SignalTable(props: Props) {
  const { signals, symbol } = props

  return (
    <CurrencyContext.Consumer>
      {({ currency, currencyRate, currencySymbol }: CurrencyContextType) => {
        return (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Token Transfer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signals.map((row, index) => {
                const {
                  timestamp,
                  value,
                  price,
                  to_address_name,
                  transaction_hash,
                } = row
                const formattedPrice = formatAbbreviatedPrice(
                  price * currencyRate,
                )
                const tokens = formatValue(value, 0)
                const ethScanLink = `https://etherscan.io/tx/${transaction_hash}`

                return (
                  <TableRow key={index}>
                    <TableCell>{moment(timestamp).fromNow()}</TableCell>
                    <TableCell>
                      <a
                        href={ethScanLink}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                      >
                        {tokens}
                      </a>{' '}
                      {symbol} ({currencySymbol}
                      {formattedPrice} {currency}) moved into {to_address_name}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      }}
    </CurrencyContext.Consumer>
  )
}
