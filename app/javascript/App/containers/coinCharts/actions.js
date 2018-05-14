export const fetchData = symbol => {
  return { type: 'FETCH_DATA', symbol }
}

export const fetchDataSuccess = response => {
  return { type: 'FETCH_DATA_SUCCESS', data: response }
}

export const renderTradingview = () => {
  return { type: 'RENDER_TRADINGVIEW' }
}
