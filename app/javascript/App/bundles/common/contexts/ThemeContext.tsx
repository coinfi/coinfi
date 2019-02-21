import * as React from 'react'
import * as _ from 'lodash'
import { withCookies, Cookies } from 'react-cookie'
import API from '~/bundles/common/utils/localAPI'
import { MuiThemeProvider } from '@material-ui/core'
import {
  black87,
  black54,
  black38,
  darkPineGreen,
  darkSlateBlue,
  foam,
  midnight,
  pearlGray,
  white,
} from '~/bundles/common/styles/colors'

export interface ThemeContextType {
  themeType: ThemeTypes
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextType>(null)

export interface ThemeProviderProps extends ThemeProviderExposedProps {
  cookies: Cookies
}

export interface ThemeProviderExposedProps {
  user?: any
  loggedIn?: boolean
  hasOuterTheme?: boolean
}

export interface ThemeProviderState {
  type: ThemeTypes
  theme: any
}

export type ThemeTypes = 'light' | 'dark'

export const THEME_TYPE_CHANGE_EVENT = 'themeTypeChange'
export interface ThemeTypeChangeEvent extends CustomEvent {
  detail: {
    type: ThemeTypes
  }
}

const defaultThemeType: ThemeTypes = 'light'
const cookieKey = 'theme'
const userKey = 'theme_type'
const cookieOptions = {
  path: '/',
}

/***
 * This is currently meant to be used in conjunction with MUI theming
 * Assumes that an outer theme provider exists unless told otherwise
 * This provider should be included as close to root as possible
 */
class ThemeProvider extends React.Component<
  ThemeProviderProps,
  ThemeProviderState
> {
  constructor(props: ThemeProviderProps) {
    super(props)

    const { cookies, user } = props
    const userThemeType = _.get(user, userKey)
    const cookieThemeType = cookies.get(cookieKey)
    const themeType = userThemeType || cookieThemeType || defaultThemeType

    // remediate server-saved theme and local-saved theme
    if (
      _.isString(userThemeType) &&
      _.isString(cookieThemeType) &&
      userThemeType !== cookieThemeType
    ) {
      cookies.set(cookieKey, userThemeType, cookieOptions)
    } else if (_.isUndefined(cookieThemeType)) {
      // save default currency if not present in cookie
      cookies.set(cookieKey, themeType, cookieOptions)
    }

    const theme = this.getTheme(themeType)

    this.state = {
      type: themeType,
      theme,
    }
  }

  public componentDidMount() {
    document.addEventListener(THEME_TYPE_CHANGE_EVENT, this.onTypeChange)
  }

  public componentWillUnmount() {
    document.removeEventListener(THEME_TYPE_CHANGE_EVENT, this.onTypeChange)
  }

  public onTypeChange = (e: ThemeTypeChangeEvent) => {
    const { type } = e.detail

    const theme = this.getTheme(type)
    if (type !== this.state.type) {
      this.setState({
        type,
        theme,
      })
    }
  }

  public toggleTheme = () => {
    const { type: oldType } = this.state
    const { cookies, loggedIn, user } = this.props

    const newType = oldType === 'light' ? 'dark' : 'light'
    const theme = this.getTheme(newType)

    cookies.set(cookieKey, newType, cookieOptions)

    this.setState({
      type: newType,
      theme,
    })

    if (loggedIn || user) {
      API.patch('/user', { userKey: newType })
    }

    const event = new CustomEvent(THEME_TYPE_CHANGE_EVENT, {
      detail: { type: newType },
    }) as ThemeTypeChangeEvent
    document.dispatchEvent(event)
  }

  public render() {
    const { type, theme: innerTheme } = this.state
    const { hasOuterTheme } = this.props

    const isDarkMode = type === 'dark'
    const payload: ThemeContextType = {
      themeType: type,
      isDarkMode,
      toggleTheme: this.toggleTheme,
    }

    const theme =
      hasOuterTheme || true
        ? (outerTheme) => ({
            ...outerTheme,
            ...innerTheme,
            palette: { ...outerTheme.palette, ...innerTheme.palette, type },
          })
        : {
            ...innerTheme,
            palette: { ...innerTheme.palette, type },
          }

    return (
      <ThemeContext.Provider value={payload}>
        <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
      </ThemeContext.Provider>
    )
  }

  private getTheme = (type: ThemeTypes) => {
    if (type === 'dark') {
      return {
        palette: {
          type: 'dark',
          background: {
            paper: darkPineGreen,
            default: midnight,
            selected: darkSlateBlue,
          },
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.87)',
          secondary: 'rgba(255, 255, 255, 0.54)',
          disabled: 'rgba(255, 255, 255, 0.38)',
          hint: 'rgba(255, 255, 255, 0.38)',
        },
      }
    } else {
      // light
      return {
        palette: {
          type: 'light',
          background: {
            paper: white,
            default: pearlGray,
            selected: foam,
          },
        },
        text: {
          primary: black87,
          secondary: black54,
          disabled: black38,
          hint: black38,
        },
      }
    }
  }
}

const ProviderWithCookies = withCookies(ThemeProvider) as React.ComponentType<
  ThemeProviderExposedProps
>
export { ProviderWithCookies as ThemeProvider }

export const withThemeType = (WrappedComponent) => (props) => (
  <ThemeContext.Consumer>
    {(payload) => <WrappedComponent {...payload} {...props} />}
  </ThemeContext.Consumer>
)

export default ThemeContext
