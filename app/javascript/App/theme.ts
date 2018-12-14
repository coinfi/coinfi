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
  breakpoints: {
    // Align with react breakpoints. Use defaults for sm and xl.
    values: {
      xs: 0,
      sm: 600,
      md: 992,
      lg: 1184,
      xl: 1920,
    },
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
  },
})

export default theme
