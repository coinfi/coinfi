import { white30, black30 } from '../colors'
import { StyleRules } from '@material-ui/core/styles/withStyles'

const switchStyle = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return {
    switch: {
      transition: 'all 0.5s',
      display: 'inline-block',
      background: isDarkMode ? white30 : black30,
      border: 'none',
      borderRadius: '999px',
      position: 'relative',
      height: '18px',
      width: '34px',
      '&:after': {
        transition: 'all 0.5s',
        content: '""', // https://stackoverflow.com/a/40966881
        display: 'block',
        height: '14px',
        width: '14px',
        borderRadius: '999px',
        background: theme.palette.background.paper,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-100%, -50%)',
      },
    },
    on: {
      background: theme.palette.primary.main,
      '&:after': {
        transform: 'translate(0%, -50%)',
      },
    },
  } as StyleRules
}

export default switchStyle
