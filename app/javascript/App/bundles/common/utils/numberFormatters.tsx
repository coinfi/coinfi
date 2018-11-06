const numericSymbols = ['k', 'M', 'B', 'T', 'P', 'E']

export function formatValue(
  value: number,
  maximumFractionDigits: number = 6,
): string {
  if (typeof value !== 'number' || value === null) {
    return ''
  }
  return value.toLocaleString('en-US', { maximumFractionDigits })
}

export function formatValueWithCurrency(
  value: number,
  currency: string,
): string {
  if (typeof value !== 'number' || value === null) {
    return ''
  }

  currency = currency.toUpperCase()

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency,
  })
}

export function formatPrice(price: number, currency: string): string {
  if (typeof price !== 'number' || price === null) {
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

export function formatAbbreviatedPrice(
  price: number,
  maximumFractionDigits: number = 1,
): string {
  if (typeof price !== 'number' || price === null) {
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
