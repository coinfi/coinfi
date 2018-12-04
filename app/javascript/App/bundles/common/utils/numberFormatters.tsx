const numericSymbols = ['k', 'M', 'B', 'T', 'P', 'E']

/***
 * Limits the maximum decimal places for an inputted number.
 * Defaults to a max of 6 decimal places.
 *
 * Examples:
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
  return value.toLocaleString('en-US', { maximumFractionDigits })
}

/***
 * Formats a number based on the desired currency with associated currency symbols.
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

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency,
  })
}

/***
 * Format a number for use as a price.
 * This allows us to set our own standard rather than use toLocaleString's.
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
  switch (currency) {
    case 'BTC': {
      return `${formatValue(price, 8)} &#579;`
    }
    default:
    case 'USD': {
      return `$${formatValue(price, 4)} ${currency}`
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
