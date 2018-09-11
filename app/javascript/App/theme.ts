import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Avenir"', 'sans-serif'].join(','),
  },
})

export default theme
