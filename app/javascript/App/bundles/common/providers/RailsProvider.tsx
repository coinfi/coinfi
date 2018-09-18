import * as React from 'react'

/**
 * Type definition for the original `railsContext` provided by the React on Rails gem
 * @see https://github.com/shakacode/react_on_rails/blob/master/docs/basics/generator-functions-and-railscontext.md
 */
interface InitialRailsContextType {
  railsEnv: any
  inMailer: boolean

  // Locale settings
  i18nLocale: any
  i18nDefaultLocale: any
  rorVersion: string
  rorPro: boolean

  // URL settings
  href: string
  location: string
  scheme: string // http
  host: string // foo.com
  port: number
  pathname: string // /posts
  search: string // id=30&limit=5
  httpAcceptLanguage: string

  // Other
  serverSide: boolean // Are we being called on the server or client?
}

/**
 * Type definition for the combined `railsContext` including custom attributes added via the
 * rendering extension
 */
export interface RailsContextType extends InitialRailsContextType {
  sizesProviderProps: {
    config: {
      fallbackWidth: number
      fallbackHeight: number
    }
  }
}

const RailsContext = React.createContext<RailsContextType>(null)

interface Props {
  railsContext: RailsContextType
  children: any
}

export const RailsProvider: React.StatelessComponent<Props> = (props) => {
  return (
    <RailsContext.Provider value={props.railsContext}>
      {props.children}
    </RailsContext.Provider>
  )
}

export const RailsConsumer = RailsContext.Consumer
