import { createMuiTheme } from '@material-ui/core/styles'
import { athens } from './bundles/common/styles/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#23adf0',
    },
    background: {
      default: athens,
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
    // @ts-ignore this exists in their code, but types haven't been updated yet
    MuiWithWidth: {
      initialWidth: 'md',
      withTheme: true,
    },
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
