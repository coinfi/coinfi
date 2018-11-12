class NorthPoleToCoinMarketCapService
  def initialize(north_pole_response)
    @body = JSON.parse(north_pole_response.body)
  end

  # Converts NorthPole proxy data format into the CoinMarketCap format.
  def convert
    market = @body["markets"][0]
    {
      "rank" => market["position"],
      "price_usd" => market["price"]["usd"],
      "price_btc" => market["price"]["btc"],
      "24h_volume_usd" => market["volume24"]["usd"],
      "market_cap_usd" => market["marketCap"]["usd"],
    }
  end
end

# CoinMarketCap
# https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=BTC
# [
#   {
#   "id": "bitcoin",
#   "name": "Bitcoin",
#   "symbol": "BTC",
#   "rank": "1",
#   "price_usd": "6415.80163679",
#   "price_btc": "1.0",
#   "24h_volume_usd": "4183641160.92",
#   "market_cap_usd": "111455947614",
#   "available_supply": "17372100.0",
#   "total_supply": "17372100.0",
#   "max_supply": "21000000.0",
#   "percent_change_1h": "0.51",
#   "percent_change_24h": "0.22",
#   "percent_change_7d": "-0.33",
#   "last_updated": "1542014658",
#   "24h_volume_btc": "652083.932416",
#   "market_cap_btc": "17372100.0"
#   }
# ]

# NorthPole
# https://coinmarketcap.northpole.ro/ticker.json?identifier=bitcoin
# {
#   "timestamp": 1542014402,
#   "markets": [
#   {
#   "position": 1,
#   "name": "Bitcoin",
#   "symbol": "BTC",
#   "identifier": "bitcoin",
#   "category": "currency",
#   "marketCap": {},
#   "price": {},
#   "availableSupply": 0,
#   "volume24": {},
#   "change1h": 0.42,
#   "change24h": 0.21,
#   "change7d": -0.34,
#   "timestamp": 1542014402
#   }
#   ],
#   "currencyExchangeRates": {
#   "usd": "1.0",
#   "aud": "0.719624298546",
#   "brl": "0.267906179256",
#   "cad": "0.757200025745",
#   "chf": "0.991267920885",
#   "clp": "0.00146094999796",
#   "cny": "0.143537922719",
#   "czk": "0.0434129451498",
#   "dkk": "0.150961397661",
#   "eur": "1.12601580701",
#   "gbp": "1.28522479867",
#   "hkd": "0.127654576927",
#   "huf": "0.00349900540771",
#   "idr": "6.75012065841e-05",
#   "ils": "0.270804560349",
#   "inr": "0.0136998561803",
#   "jpy": "0.00877192982456",
#   "krw": "0.000879855703665",
#   "mxn": "0.0495093622204",
#   "myr": "0.238929899879",
#   "nok": "0.118117862728",
#   "nzd": "0.67146991479",
#   "php": "0.0187883399562",
#   "pkr": "0.0074446290638",
#   "pln": "0.262113579056",
#   "rub": "0.014818986085",
#   "sek": "0.109566119263",
#   "sgd": "0.723065276164",
#   "thb": "0.030194148374",
#   "try": "0.182286857901",
#   "twd": "0.0324513384068",
#   "zar": "0.0695925848266"
#   },
#   "global": {
#   "total_market_cap": 212541147411.5398,
#   "total_24h_volume": 13009017282.841162,
#   "bitcoin_percent_of_market_cap": 52.44,
#   "active_currencies": 2094,
#   "active_assets": 0
#   }
# }
