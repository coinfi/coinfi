import * as React from 'react'
import * as _ from 'lodash'
import { AgGridReact } from 'ag-grid-react'
import ColumnNames from './ColumnNames'

interface Props {
  coins: CoinData[]
  watchList: number[]
  loggedIn: boolean
}

interface State {
  columnDefs: any
  rowData: EnhancedCoinData[]
}

interface CoinData {
  id: number
  name: string
  symbol: string
  slug: string
  coin_key: string
  ranking: number
  image_url: string
  price: any
  market_cap: any
  change1h: string
  change24h: string
  change7d: string
  volume24: string
  sparkline: string
}

interface EnhancedCoinData extends CoinData {
  isWatched: boolean
}

class HomeIndex extends React.Component<Props, State> {
  public api
  public columnApi

  constructor(props) {
    super(props)

    // combine stars with coins
    const coins = props.coins || []
    const enhancedCoins = props.watchList
      ? coins.map((coin) => {
          const isWatched =
            _.findIndex(props.watchList, (id) => coin.id === id) >= 0

          return {
            ...coin,
            isWatched,
          }
        })
      : [...props.coins]

    this.state = {
      columnDefs: ColumnNames('USD'),
      rowData: enhancedCoins,
    }
  }

  public onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi

    this.api.sizeColumnsToFit()
  }

  public render() {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          display: 'flex',
          flex: 1,
        }}
      >
        <div
          className="ag-theme-material"
          style={{
            width: '100%',
          }}
        >
          <AgGridReact
            enableSorting={true}
            suppressCellSelection={true}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    )
  }
}

export default HomeIndex
