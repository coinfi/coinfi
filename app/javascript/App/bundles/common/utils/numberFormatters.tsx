import * as numeral from 'numeral'
import * as _ from 'lodash'
import currencyMap from '../constants/currencyMap'
const numericSymbols = ['k', 'M', 'B', 'T', 'P', 'E']

/***
 * Limits the maximum decimal places for an inputted number.
 * Defaults to a max of 6 decimal places.
 *
 * Examples:
 * formatValue(10000.0, 2)   -> "10,000"
 * formatValue(10.000001, 2) -> "10.00"
 * formatValue(10, 2)        -> "10"
 */
export function formatValue(
  value: number,
  maximumFractionDigits: number = 6,
): string {
  if (isNaN(value) || value === null) {
    return ''
  }
  const format = `0,0.[${_.repeat('0', maximumFractionDigits)}]`
  return numeral(value).format(format)
}

/***
 * Sets the amount of decimal places for an inputted number.
 * Defaults to 2 decimal places.
 *
 * Examples:
 * formatValue(10000.0, 2)   -> "10,000.00"
 * formatValue(10.000001, 2) -> "10.00"
 * formatValue(10, 2)        -> "10.00"
 */
export function formatValueFixed(
  value: number,
  fractionDigits: number = 2,
): string {
  if (isNaN(value) || value === null) {
    return ''
  }
  const format = `0,0.${_.repeat('0', fractionDigits)}`
  return numeral(value).format(format)
}

/***
 * Formats a number based on the desired currency with associated currency symbols.
 * Note: does not handle if symbol is prefix/suffix and localization
 *
 * Examples:
 * formatValueWithCurrency(10, 'USD') -> "$10.00"
 * formatValueWithCurrency(10, 'EUR') -> "€10.00"
 */
export function formatValueWithCurrency(
  value: number,
  currency: string,
): string {
  if (isNaN(value) || value === null) {
    return ''
  }

  currency = currency.toUpperCase()
  const currencySymbol = _.get(currencyMap, currency, '')

  return `${currencySymbol}${formatValueFixed(value, 2)}`
}

/***
 * Limits the maximum decimal places for an inputted number.
 * Adjusts the maximum decimal places according to a given rate.
 * Also possible to change the limitations; defaults are set based on the defaults for formatValue()
 * Specifically, 6 decimal places for currencyRate = 1 with min/max of -/+ 4, respectively
 *
 * Examples:
 * formatValueByCurrencyRate(10, 1) -> "10"
 * formatValueByCurrencyRate(10.00001, 1) -> "10.00001"
 * formatValueByCurrencyRate(10.00001, 1000) -> "10"
 * formatValueByCurrencyRate(10000.01, 1000) -> "10,000.01"
 */
export function formatValueByCurrencyRate(
  value: number,
  currencyRate: number,
  options?: {
    minimumFractionDigits: number
    defaultFractionDigits: number
    maximumFractionDigits: number
  },
): string {
  const minimumFractionDigits = _.get(options, 'minimumFractionDigits', 2)
  const defaultFractionDigits = _.get(options, 'defaultFractionDigits', 6)
  const maximumFractionDigits = _.get(options, 'maximumFractionDigits', 10)

  // adjust decimal places based on currency rate;

  const powerOf10 = Math.round(Math.log10(currencyRate))
  const currencyAdjustedMaximumFractionDigits = _.clamp(
    defaultFractionDigits - powerOf10,
    minimumFractionDigits,
    maximumFractionDigits,
  )

  return formatValue(value, currencyAdjustedMaximumFractionDigits)
}

/***
 * Format a number for use as a price.
 * This allows us to set our own standard per currency.
 * This can also be useful for cryptocurrencies.
 *
 * Examples:
 * formatPrice(10, 'USD') -> "$10.0000 USD"
 * formatPrice(10, 'BTC') -> "10.00000000 Ƀ"
 */
export function formatPrice(price: number, currency: string): string {
  if (isNaN(price) || price === null) {
    return ''
  }

  currency = currency.toUpperCase()
  const currencySymbol = _.get(currencyMap, currency, '')

  switch (currency) {
    case 'BTC': {
      return `${formatValue(price, 8)} &#579;`
    }
    case 'JPY':
    case 'KRW': {
      return `${currencySymbol}${formatValue(price, 2)} ${currency}`
    }
    default:
    case 'USD': {
      return `${currencySymbol}${formatValue(price, 4)} ${currency}`
    }
  }
}

/***
 * Formats a number using a letter to denote 10^3N significant places.
 * Defaults to a max of 1 decimal place.
 *
 * Examples:
 * formatPrice(10003, 3) -> "10.003k"
 * formatPrice(1000000)  -> "1M"
 */
export function formatAbbreviatedPrice(
  price: number,
  maximumFractionDigits: number = 1,
): string {
  if (isNaN(price) || price === null) {
    return ''
  }

  let i = -1
  while (i < numericSymbols.length - 1) {
    if (price / 1000 >= 1) {
      price = price / 1000
      i++
    } else {
      break
    }
  }
  return (
    formatValue(price, maximumFractionDigits) +
    (i >= 0 ? `${numericSymbols[i]}` : '')
  )
}
