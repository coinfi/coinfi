import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import { ItemWithCoinLinkData, CoinLinkData, CoinClickHandler } from '../types'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { aqua } from '~/bundles/common/styles/colors'
import { sansAlt } from '~/bundles/common/styles/typography'
import { sp2 } from '~/bundles/common/styles/spacing'

interface Props {
  itemWithCoinLinkData: ItemWithCoinLinkData
  onClick?: CoinClickHandler
  getLink?: (coinData: CoinLinkData) => string
  className?: string
  classes: any
}

const styles = (theme) =>
  createStyles({
    tag: {
      display: 'inline-block',
      color: aqua,
      fontSize: '0.8rem',
      fontFamily: sansAlt,
      borderRadius: '2px',
      fontWeight: 600,
      '&:not(:last-of-type)': {
        marginRight: sp2,
      },
    },
    pointer: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  })

const CoinTags = ({
  itemWithCoinLinkData,
  onClick,
  getLink,
  classes,
  className,
}: Props) => {
  const linkData = _.get(
    itemWithCoinLinkData,
    'coin_link_data',
    [] as CoinLinkData[],
  )
  return (
    <div className={className}>
      {linkData.map((data, index) => {
        const isClickable = !!onClick
        const onClickHandler = isClickable
          ? (e) => {
              e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              onClick(data)
            }
          : undefined
        const link = getLink ? getLink(data) : undefined

        return (
          <a
            key={index}
            className={classnames(classes.tag, classes.pointer)}
            onClick={onClickHandler}
            href={link}
          >
            {data.symbol}
          </a>
        )
      })}
    </div>
  )
}

export default withStyles(styles)(CoinTags)
