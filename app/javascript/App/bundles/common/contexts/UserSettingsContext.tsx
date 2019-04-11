import * as React from 'react'
import * as _ from 'lodash'
import { withCookies, Cookies } from 'react-cookie'
import API from '~/bundles/common/utils/localAPI'

enum STATUS {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

export interface UserSettingsContextType {
  defaultToTradingView: boolean
  setDefaultToTradingView: (setting: boolean) => void
}

const UserSettingsContext = React.createContext<UserSettingsContextType>(null)

export interface UserSettingsContextProps {
  cookies: Cookies
  user?: any
}

export interface UserSettingsContextState {
  status: string
  defaultToTradingView: boolean
}

export const USER_SETTINGS_CHANGE_EVENT = 'userSettingsChange'
export interface UserSettingsChangeEvent extends CustomEvent {
  detail: {
    defaultToTradingView: boolean
  }
}

const defaultTradingView = false
const cookieTradingViewKey = 'trading_view'
const userTradingViewKey = ['token_sale', 'default_trading_view']
const cookieOptions = {
  path: '/',
}

class UserSettingsProvider extends React.Component<
  UserSettingsContextProps,
  UserSettingsContextState
> {
  constructor(props: UserSettingsContextProps) {
    super(props)

    const { cookies, user } = props
    const userDefaultToTradingView = _.get(user, userTradingViewKey)
    const cookieDefaultToTradingView = cookies.get(cookieTradingViewKey, {
      doNotParse: false,
    })
    const defaultToTradingView = !_.isUndefined(userDefaultToTradingView)
      ? userDefaultToTradingView
      : !_.isUndefined(cookieDefaultToTradingView)
        ? cookieDefaultToTradingView
        : defaultTradingView

    // remediate between server and local
    if (
      !_.isUndefined(userDefaultToTradingView) &&
      !_.isUndefined(cookieDefaultToTradingView) &&
      userDefaultToTradingView !== cookieDefaultToTradingView
    ) {
      cookies.set(cookieTradingViewKey, userDefaultToTradingView, cookieOptions)
    } else if (_.isUndefined(cookieDefaultToTradingView)) {
      // save default currency if not present in cookie
      cookies.set(cookieTradingViewKey, defaultToTradingView, cookieOptions)
    }

    this.state = {
      status: STATUS.INITIALIZING,
      defaultToTradingView,
    }
  }

  public componentDidMount() {
    document.addEventListener(
      USER_SETTINGS_CHANGE_EVENT,
      this.onUserSettingsChange,
    )
  }

  public componentWillUnmount() {
    document.removeEventListener(
      USER_SETTINGS_CHANGE_EVENT,
      this.onUserSettingsChange,
    )
  }

  public onUserSettingsChange = (e: UserSettingsChangeEvent) => {
    const { defaultToTradingView } = e.detail

    if (defaultToTradingView !== this.state.defaultToTradingView) {
      this.setState({
        defaultToTradingView,
      })
    }
  }

  // Use this to make changes that should only be performed by one provider
  public setDefaultToTradingView = (defaultToTradingView: boolean) => {
    const { cookies, user } = this.props
    const { defaultToTradingView: previousState } = this.state

    if (previousState === defaultToTradingView) {
      return
    }

    cookies.set(cookieTradingViewKey, defaultToTradingView, cookieOptions)

    this.setState({
      defaultToTradingView,
    })

    if (user) {
      API.patch('/user', { trading_view: defaultToTradingView })
    }

    const event = new CustomEvent(USER_SETTINGS_CHANGE_EVENT, {
      detail: { defaultToTradingView },
    }) as UserSettingsChangeEvent
    document.dispatchEvent(event)
  }

  public render() {
    const payload: UserSettingsContextType = {
      defaultToTradingView: this.state.defaultToTradingView,
      setDefaultToTradingView: this.setDefaultToTradingView,
    }

    return (
      <UserSettingsContext.Provider value={payload}>
        {this.props.children}
      </UserSettingsContext.Provider>
    )
  }
}
const ProviderWithCookies = withCookies(UserSettingsProvider)
export { ProviderWithCookies as UserSettingsProvider }

export const withUserSettings = (WrappedComponent) => (props) => (
  <UserSettingsContext.Consumer>
    {(payload) => <WrappedComponent {...payload} {...props} />}
  </UserSettingsContext.Consumer>
)

export default UserSettingsContext
