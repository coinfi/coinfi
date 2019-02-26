import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = (theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
      borderColor: theme.palette.border.main,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      height: '60px',
      padding: '1rem',
      display: 'flex',
      flex: 'none',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  })

const SectionHeader = ({ children, classes }) => (
  <div className={classes.root}>{children}</div>
)

export default withStyles(styles)(SectionHeader)
