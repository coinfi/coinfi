import { createContext } from 'react'

export interface ExchangeListingsContextType {
  toggleFilterPanel: () => void
  showFilterPanel: boolean
  applyFilters: () => void
  quoteSymbols: string[]
  exchanges: string[]
  changeSymbol: (data: any) => void
  changeExchange: (data: any) => void
  filterDates: (data: any) => void
  selectedItems: {
    detectedSince: string
    detectedUntil: string
  }
  selectedSymbols: string[]
  selectedExchanges: string[]
  exchangeSlugs: string[]
  resetFilters: () => void
}

const ExchangeListingsContext = createContext<ExchangeListingsContextType>(null)

export default ExchangeListingsContext
