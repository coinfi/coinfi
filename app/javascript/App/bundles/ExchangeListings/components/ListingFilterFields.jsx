import React from 'react'
import ListingFilterQuoteSymbolField from './ListingFilterQuoteSymbolField'
import ItemSelectorDate from './../../../components/ItemSelectorDate'
import ListingFilterExchangeField from './ListingFilterExchangeField'

export default (props) => (
  <div className="pa3">
    <ListingFilterQuoteSymbolField />
    <h4>Date Range</h4>
    <ItemSelectorDate />
    <ListingFilterExchangeField />
    {/*
    */}
  </div>
)
