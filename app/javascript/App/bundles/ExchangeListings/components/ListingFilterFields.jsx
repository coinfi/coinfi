import React from 'react'
import ListingFilterQuoteSymbolField from './ListingFilterQuoteSymbolField'
import ItemSelectorDate from './../../../components/ItemSelectorDate'
//import ListingFilterExchangesField from './ListingFilterExchangeField'

export default (props) => (
  <div className="pa3">
    <ListingFilterQuoteSymbolField />
    <ItemSelectorDate />
    {/*
    <ListingFilterExchangesField />
    */}
  </div>
)
