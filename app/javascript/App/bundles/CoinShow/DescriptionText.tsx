import * as React from 'react'
import * as _ from 'lodash'
import * as moment from 'moment'
import * as ReactMarkdown from 'react-markdown'
import {
  formatPrice,
  formatVolume,
  formatPercentage,
  formatSupply,
} from '~/bundles/common/utils/numberFormatters'
import { groupMarketData } from './MarketsChart'
import { CurrencyContextType } from '~/bundles/common/contexts/CurrencyContext'
import MarkupLink from '~/bundles/common/components/MarkupLink'

interface CoinArticle {
  title: string
  path: string
}

const formatArrayMembers = (list, n = 3) => {
  if (!Array.isArray(list)) {
    return null
  }
  list = list.slice(0, n)
  const length = list.length

  return list.reduce((str, item, index) => {
    if (index === 0) {
      return `${item}`
    } else if (index === length - 1) {
      return length > 2 ? `${str}, and ${item}` : `${str} and ${item}`
    } else {
      return `${str}, ${item}`
    }
  }, '')
}

export default function DescriptionText({
  coinObj,
  currencyCtx,
  relatedArticle,
}: {
  coinObj: CoinObj
  currencyCtx: CurrencyContextType
  relatedArticle?: CoinArticle
}) {
  const {
    name: coinName,
    symbol,
    market_pairs: marketPairs,
    total_market_pairs: totalMarketPairs,
    price: usdPrice,
    volume24h: usdVolume24h,
    market_cap: usdMarketCap,
    change24h,
    ranking,
    updated_at,
    ico_start_date,
    ico_end_date,
    ico_usd_raised,
    ico_token_price_usd,
    ico_tokens_sold,
    team,
    available_supply,
    fixed_supply,
    description,
    blockchain_tech,
  } = coinObj
  const { currency, currencySymbol, currencyRate } = currencyCtx
  const price = formatPrice(usdPrice * currencyRate)
  const volume24h = formatVolume(usdVolume24h * currencyRate)
  const marketCap = formatPrice(usdMarketCap * currencyRate)
  const updatedAt = moment(updated_at).format('MMMM DD, YYYY')

  const icoEndDate = ico_end_date
    ? moment(ico_end_date).format('MMMM DD, YYYY')
    : null
  const icoStartDate = ico_start_date
    ? moment(ico_start_date).format('MMMM DD, YYYY')
    : null
  const icoRaised = ico_usd_raised
    ? formatPrice(ico_usd_raised * currencyRate)
    : null
  const icoTokensSold = ico_tokens_sold
  const isoTokenPrice = ico_token_price_usd
    ? formatPrice(ico_token_price_usd * currencyRate)
    : null
  const hasFinishedIco =
    !!icoEndDate && (!!icoRaised || !!icoTokensSold || !!isoTokenPrice)
  const teamArray = Array.isArray(team)
    ? team.slice(0, 3).map(({ name }) => name)
    : null
  const teamMembers = formatArrayMembers(teamArray, 3)
  const circulatingSupply = !_.isUndefined(available_supply)
    ? formatSupply(available_supply)
    : null
  const maxSupply = !_.isUndefined(fixed_supply)
    ? formatSupply(fixed_supply)
    : null
  const hasSupply = !!circulatingSupply && !!maxSupply
  const marketDataByPair = Array.isArray(marketPairs)
    ? groupMarketData(marketPairs, 'pair')
        .slice(0, 3)
        .map(({ name }) => name)
    : null
  const marketDataByExchange = Array.isArray(marketPairs)
    ? groupMarketData(marketPairs, 'exchange')
        .slice(0, 3)
        .map(({ name }) => name)
    : null
  const topPairs = formatArrayMembers(marketDataByPair, 3)
  const topExchanges = formatArrayMembers(marketDataByExchange, 3)

  return (
    <>
      <h2>What Is {coinName}'s Price Today?</h2>
      <p>
        <strong>{coinName}</strong> ({symbol}) is trading at {currencySymbol}
        {price} {currency}, {change24h >= 0 ? 'increasing' : 'decreasing'} by{' '}
        {formatPercentage(change24h)}% since yesterday. {coinName} has traded{' '}
        {currencySymbol}
        {volume24h} {currency} in the last 24 hours.
      </p>
      {ranking && (
        <p>
          {coinName} ({symbol}) is the #{ranking} largest cryptocurrency by
          market cap as of {updatedAt}, with a market cap of {currencySymbol}
          {marketCap} {currency}.
        </p>
      )}
      {hasFinishedIco && (
        <>
          <h3>How Much Did {coinName} Raise?</h3>
          <p>
            The {coinName} ICO (initial coin offering) raised{' '}
            {icoRaised ? `${currencySymbol}${icoRaised} ${currency}` : 'funds'}
            {icoTokensSold && ` by selling ${icoTokensSold} ${coinName} tokens`}
            {isoTokenPrice &&
              ` at a price of ${currencySymbol}${isoTokenPrice} ${currency}`}.
            The {coinName} ICO{icoStartDate && ` began on ${icoStartDate} and `}{' '}
            ended on {icoEndDate}.{teamArray &&
              ` Key team members during the ${coinName} ICO included ${teamMembers}.`}
          </p>
        </>
      )}
      {(description || blockchain_tech) && (
        <>
          <h2>
            What Is {coinName} Cryptocurrency ({symbol})?
          </h2>
          {description ? (
            <ReactMarkdown renderers={{ link: MarkupLink }}>
              {description}
            </ReactMarkdown>
          ) : (
            <p>
              Tezos is a coin that operates on the {blockchain_tech} blockchain
            </p>
          )}
        </>
      )}
      {hasSupply && (
        <>
          <h3>How Many {coinName} Coins Are There?</h3>
          <p>
            There are currently {circulatingSupply} {coinName} coins circulating
            out of a max supply of {maxSupply}.
          </p>
        </>
      )}
      {_.isNumber(totalMarketPairs) && (
        <>
          <h2>Buying/Selling {coinName} On Cryptocurrency Exchanges</h2>
          <p>
            {coinName} is trading on {totalMarketPairs} markets. In the last 24
            hours, {coinName} was most traded on {topExchanges}. The most traded{' '}
            {coinName} pairs in the last 24 hours are {topPairs}.
          </p>
        </>
      )}
      {relatedArticle && (
        <p>
          <a href={relatedArticle.path}>{relatedArticle.title}</a>
        </p>
      )}
    </>
  )
}
