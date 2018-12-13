import * as React from 'react'
import { renderToString } from 'react-dom/server'
import * as _ from 'lodash'
import withRootProviders from '~/withRootProviders'
import getOrCreateStylesContext from '~/getOrCreateStylesContext'

/**
 * Generator function for a component hash to be used with React on Rails `react_component` and
 * `react_component_hash`. Use this on any component to allow it to be rendered server side
 * @param TargetComponent Component to render. Note that `railsContext` will not be passed as an
 *   argument to this component
 */
const createServerComponentHash = (TargetComponent: any) => {
  return (props, railsContext) => {
    // Render to HTML passing in `context` to be updated
    const stylesNamespace = props.stylesNamespace
    const stylesContextStore = {}
    const componentHtml = renderToString(
      withRootProviders(TargetComponent, {
        stylesNamespace,
        stylesContextStore,
      })(props, railsContext),
    )

    // Return the successful markup as a string for Rails `react_component` and
    // `react_component_hash` to handle
    // see: https://github.com/shakacode/react_on_rails#react_component_hash-for-generator-functions
    return {
      renderedHtml: {
        componentHtml,
        // As this is a shared `SheetsRegistry`, the styles will include ones from other components
        // as well
        componentCss: getOrCreateStylesContext(
          stylesNamespace,
          stylesContextStore,
        ).sheetsRegistry.toString(),
        componentStylesNamespace: stylesNamespace,
      },
    }
  }
}

export default createServerComponentHash
