import * as React from 'react'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { createStyles, withStyles } from '@material-ui/core/styles'

const styles = (theme) =>
  createStyles({
    root: {},
    standaloneRoot: {
      marginLeft: '0 !important',
    },
    label: {
      color: 'white',
      fontSize: 14,
      fontWeight: 500,
    },
  })

const DarkModeToggle = ({ isDarkMode, onChange, standAlone, classes }) => {
  standAlone = !!standAlone

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isDarkMode}
          onChange={onChange}
          value={isDarkMode}
          color="default"
        />
      }
      labelPlacement="start"
      label="Dark Mode"
      classes={{
        label: classes.label,
        root: standAlone ? classes.standaloneRoot : classes.root,
      }}
    />
  )
}

export default withStyles(styles)(DarkModeToggle)
