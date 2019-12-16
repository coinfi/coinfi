# CoinFi

## The Cryptocurrency Market Intelligence Platform

https://www.coinfi.com

### The CoinFi Platform

[![Build Status](https://semaphoreci.com/api/v1/coinfi/coinfi/branches/develop/badge.svg)](https://semaphoreci.com/coinfi/coinfi)

#### Crowdsourced and Curated Real-Time News Database

The CoinFi database will enable users to monitor and analyze real-time crypto market news alongside price charts in ways that are currently impossible with existing tools. It changes the current delivery frequency of market news from delayed, to near real-time.

#### Historical News and Impact on Price Movements

For an investor, especially one new to the cryptocurrency space, the ability to identify correlations between news and historical price movements is crucial to gaining an understanding of the markets. The ability to quickly review a price chart and correlate market movements with relevant news adds tremendous value for traders.

#### Institutional Class Trading Signals

There are multiple proprietary trading signals our team is looking to build based on models used by high frequency hedge funds.

While CoinFi will seed the platform with internally developed quantitative models, the platform will also allow traders to share and monetize their own trading signals, applying the wisdom of the crowds to quantitative modelling in the crypto space.

#### Institutional Class Trading Algorithms

There also exist multiple trading algorithms our team will develop based on models used by high frequency hedge funds, including identifying best price execution exchange, trade cloaking for high volume inflows/outflows on illiquid tokens, sniper algorithms for obtaining liquidity, and more.

For more details, please see the [CoinFi white paper](https://docs.google.com/document/d/1p6xaFl4nPv1CuJv6F2fkZ6qBq2lBS6ePyFna8QZt1KM/edit).

### Roadmap

Prototype: Develop foundation for real-time news platform: [Commit `a179fdd` on Oct 31, 2017](https://github.com/coinfi/coinfi/commit/a179fddc40c3daf1670cb588d7c27d2057dbc578)

Prototype: Initial trading signals: [Commit `45150ca` on Nov 9, 2017](https://github.com/coinfi/coinfi/commit/45150ca3f8ad76ff986c0bc4275b4d6911c32a83)

**2018Q1: Platform**

* News and content aggregation overlaid on price charts per cryptocurrency
* Obtain minute-level historical price data and market data feeds for cryptocurrencies
* Develop editorial procedures, begin in-house compilation of news aggregation on existing cryptocurrencies
* Search and filter functionality
* User authentication and authorization
* Social functionality including upvote/downvote and sharing
* Prototype of machine learning algorithms for content classification, quality assurance, and fraud detection

**2018Q2: Personalization**

* Custom Newsfeed with news type classification
* Improved news and content aggregation overlaid on price charts per cryptocurrency
* Improved custom watchlist
* Coin Screeners
* Advanced ICO Metrics (token retention rate, token distribution graph)
* Improved data pipeline
* Market data warehouse
* In-house crypto research & analysis

**2018Q3: Economy**

* Custom cryptocurrency portfolio dashboard
* Allow users to follow others’ portfolios
* Accept staked tokens for advanced functionality
* Token-incentivized crowdsourcing
* Social functionality including upvote/downvote and sharing

**2018Q4: Trading Signals**

* Initial beta versions of trading signals
* Prototype of machine learning algorithms for content classification, quality assurance, and fraud detection

**2019Q1**

* Abnormal volatility detection
* Abnormal price movement detection
* Abnormal volume detection
* Increased social mention detection
* Best price exchange identification
* Best currency pair identification
* Source code release detection
* Launch premium subscription for trading signals
* Accept community contributed trading signals

**2019Q2: Trading Algorithms**

* VWAP (Volume Weighted Average Price)
* TWAP (Time Weighted Average Price)
* BWAP (Block Weighted Average Price)
* Sniper
* % of Volume
* Target Close
* Implementation Shortfall
* Launch premium subscription for trading algorithms
* Accept community contributed trading algorithms

**2019Q3: Auction Framework**

* Platform architecture for custom signals
* UI/UX for developing custom signals
* Drag and drop functionality to combine signals
* Custom alerting

**2019Q4: Combining / Customizing Signals**

Note that the roadmap outlined above is subject to change based on user feedback, market conditions, and the competitive landscape. It is merely intended as an overview to explain the features that CoinFi intends to implement on the platform.

---

# Contributing

This app uses Webpack (via Webpacker) and Babel in order to make use of modern JS, so don't forget to run `bin/webpack-dev-server` when developing locally.
If you're deploying to Heroku, ensure you have the `heroku/nodejs` and `heroku/ruby` buildpacks configured (in that order).

## Coding style guide

In the project root you'll find an `.eslintrc.json` and `.stylelintrc.json`, so for for JS development please ensure you're using the following extensions:

* ESLint
* Prettier
