export const fetchPrices = symbol =>
  new Promise(resolve => {
    $.getJSON(
      `${window.pricesURL}api/v1/coins/${symbol}/daily_history.json`,
      data => resolve(data)
    )
  })

export default fetchPrices
