import * as React from 'react'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { createStyles, withStyles } from '@material-ui/core/styles'
import Icon from '~/bundles/common/components/Icon'
import classnames from 'classnames'
import { pearlGray, white } from '~/bundles/common/styles/colors'

interface Props {
  isDarkMode: boolean
  onChange: (event: object, checked: boolean) => void
  standAlone?: boolean
  classes: any
}

const styles = (theme) =>
  createStyles({
    root: {},
    standaloneRoot: {
      marginLeft: '0 !important',
    },
    label: {
      color: white,
      fontSize: 14,
      fontWeight: 500,
    },
    standaloneLabel: {
      marginRight: '-12px',
      marginBottom: '4px',
    },
    colorSwitchBase: {
      '&:not($colorChecked)': {
        '& + $colorBar': {
          backgroundColor: pearlGray,
        },
      },
    },
    colorChecked: {},
    colorBar: {},
  })

const DarkModeToggle = ({
  isDarkMode,
  onChange,
  standAlone,
  classes,
}: Props) => {
  standAlone = !!standAlone

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isDarkMode}
          onChange={onChange}
          value={isDarkMode}
          color="default"
          classes={{
            switchBase: classes.colorSwitchBase,
            checked: classes.colorChecked,
            bar: classes.colorBar,
          }}
        />
      }
      labelPlacement="start"
      label={standAlone ? <Icon name="moon-stars" solid={true} /> : 'Dark Mode'}
      classes={{
        label: classnames(classes.label, {
          [classes.standaloneLabel]: standAlone,
        }),
        root: standAlone ? classes.standaloneRoot : classes.root,
      }}
    />
  )
}

export default withStyles(styles)(DarkModeToggle)
