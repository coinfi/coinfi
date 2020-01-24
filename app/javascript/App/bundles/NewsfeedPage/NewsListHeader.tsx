import * as React from 'react'
import * as _ from 'lodash'
import SectionHeader from '~/bundles/common/components/SectionHeader'
import CoinTipsTab from '../common/components/CoinTipsTab'
import FilterPanel from './FilterPanel'
import CoinSelector, {
  CoinOption,
} from '~/bundles/common/components/CoinSelector'
import { Filters } from './types'
import withDevice, {
  DeviceContextType,
} from '~/bundles/common/utils/withDevice'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  btn,
  btnXs,
  btnWhite,
  btnWhiteDark,
  btnBlue,
} from '~/bundles/common/styles/buttons'
import {
  withThemeType,
  ThemeContextType,
} from '~/bundles/common/contexts/ThemeContext'
const filterBtn = require('~/images/filterBtn.svg') // tslint:disable-line

interface Props extends ThemeContextType, DeviceContextType {
  classes: any
  showFilters: boolean
  categories: string[]
  feedSources: string[]
  topCoinSlugs: string[]
  filters: Filters
  applyFilters: (filters: Filters) => void
  toggleFilters: () => void
  toggleNewsfeedTips: () => void
  showCoinListDrawer?: () => void
  onCoinChange: (selectedOption: CoinOption) => void
  selectedCoin: string
}

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    panelHeader: {
      alignItems: 'center',
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
      display: 'flex',
    },
    searchWrapper: {
      flex: '1 1 auto',
      marginLeft: '1em',
      minWidth: '160px',
      maxWidth: '300px',
    },
    filterBtn: {
      ...btn(theme),
      ...btnXs(theme),
      ...(isDarkMode ? btnWhiteDark : btnWhite),
      ...(isDarkMode && {
        '& img': {
          filter: 'invert(100)',
        },
      }),
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'none',
      marginLeft: '0.5rem',
    },
    coinsBtn: {
      ...btn(theme),
      ...btnXs(theme),
      ...btnBlue,
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'none',
      marginLeft: 0,
      marginRight: '0.5rem',
    },
  })
}

class NewsListHeader extends React.Component<Props, {}> {
  public render() {
    const { classes } = this.props
    return (
      <>
        {this.props.isMobile && (
          <CoinTipsTab
            showCoinListDrawer={this.props.showCoinListDrawer}
            showTips={this.props.toggleNewsfeedTips}
          />
        )}
        <SectionHeader>
          <div id="panel-header" className={classes.panelHeader}>
            <button
              onClick={this.props.toggleFilters}
              className={classes.filterBtn}
            >
              <img
                style={{ height: 10, marginRight: 10 }}
                src={filterBtn}
                alt="Filter Icon"
              />
              Filters
            </button>
            <div className={classes.searchWrapper}>
              <CoinSelector
                selectedCoin={this.props.selectedCoin}
                onChange={this.props.onCoinChange}
                placeholder="Search Coins"
                isDarkMode={this.props.isDarkMode}
              />
            </div>
          </div>
        </SectionHeader>
        {this.props.showFilters && (
          <FilterPanel
            categories={this.props.categories}
            feedSources={this.props.feedSources}
            filters={this.props.filters}
            closeFilterPanel={this.props.toggleFilters}
            applyFilters={this.props.applyFilters}
            newsFeedStyle={true}
          />
        )}
      </>
    )
  }
}

export default withStyles(styles)(withThemeType(withDevice(NewsListHeader)))
