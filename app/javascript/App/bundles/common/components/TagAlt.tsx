import * as React from 'react'
import * as _ from 'lodash'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { gray, moonGray, nearWhite } from '~/bundles/common/styles/colors'
import { sansAlt } from '~/bundles/common/styles/typography'
import { sp2 } from '~/bundles/common/styles/spacing'

const styles = (theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      color: gray,
      backgroundColor: nearWhite,
      fontSize: '0.8rem',
      fontFamily: sansAlt,
      fontWeight: 'normal',
      border: `1px solid ${moonGray}`,
      borderRadius: '2px',
      padding: sp2,
      '&:not(:last-of-type)': {
        marginRight: sp2,
      },
    },
  })

const TagAlt = ({ classes, tag }) => {
  return <div className={classes.root}>{tag}</div>
}

export default withStyles(styles)(TagAlt)
