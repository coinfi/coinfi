import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2096f3',
    },
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Avenir"', 'sans-serif'].join(','),
    useNextVariants: true,
  },
  props: {
    MuiInputLabel: {
      shrink: true,
    },
    MuiInput: {
      disableUnderline: true,
    },
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        padding: '10px 24px',
      },
    },
    MuiInput: {
      formControl: {
        'label + &': {
          marginTop: 24,
        },
      },
    },
    MuiTableCell: {
      paddingDense: {
        paddingLeft: '5px',
        paddingRight: '5px',
        '&:first-child': {
          paddingLeft: '8px',
        },
        '&:last-child': {
          paddingRight: '8px',
        },
      },
    },
  },
})

export default theme
