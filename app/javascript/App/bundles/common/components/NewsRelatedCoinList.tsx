import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import { CoinWithDetails } from '~/bundles/common/types'

const styles = (theme) =>
  createStyles({
    root: {
      listStyle: 'none',
      paddingLeft: 0,
    },
    item: {
      paddingTop: '3px',
      paddingBottom: '3px',
    },
  })

interface Props {
  classes: any
  relatedCoinsData: CoinWithDetails['related_coins_data']
}

const NewsRelatedCoinList: React.StatelessComponent<Props> = (props) => {
  const { classes, relatedCoinsData } = props

  return (
    <ul className={classes.root}>
      {relatedCoinsData.map((relatedCoinData) => (
        <li key={relatedCoinData.id} className={classes.item}>
          <Link to={`/news/${relatedCoinData.slug}`}>
            {`${relatedCoinData.name} News`}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default withStyles(styles)(NewsRelatedCoinList)
