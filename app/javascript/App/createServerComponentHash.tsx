import * as React from 'react'
import { renderToString } from 'react-dom/server'
import * as _ from 'lodash'
import { SheetsRegistry } from 'jss'
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core'
import JssProvider from 'react-jss/lib/JssProvider'
import theme from './theme'

const sheetsRegistry = new SheetsRegistry()
const sheetsManager = new Map()
const generateClassName = createGenerateClassName()

/**
 * Generator function for a component hash to be used with React on Rails `react_component` and
 * `react_component_hash`. Use this on any component to allow it to be rendered server side
 * @param fn Component to render. Must be in the form of a function instead of a class as we need to
 *   pass in `railsContext` in addition to `props`
 */
const createServerComponentHash = (
  fn: (props: any, railsContext: any) => React.ReactNode,
) => {
  return (props, railsContext) => {
    // Render to HTML passing in `context` to be updated
    const componentHtml = renderToString(
      <JssProvider
        registry={sheetsRegistry}
        generateClassName={generateClassName}
      >
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          {fn(props, railsContext)}
        </MuiThemeProvider>
      </JssProvider>,
    )

    // Return the successful markup as a string for Rails `react_component` and
    // `react_component_hash` to handle
    // see: https://github.com/shakacode/react_on_rails#react_component_hash-for-generator-functions
    return {
      renderedHtml: {
        componentHtml,
        // As this is a shared `SheetsRegistry`, the styles will include ones from other components
        // as well
        componentCss: sheetsRegistry.toString(),
      },
    }
  }
}

export default createServerComponentHash
