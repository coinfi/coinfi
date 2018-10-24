import * as React from 'react'

interface Props {
  stylesNamespace: string
}

/**
 * Removes server side styles generated through jss when the component mounts (or loads client side)
 *
 * Will only attempt to remove styles corresponding to the `stylesNamespace` in order to avoid styles
 * still in use by components. Unfortunately if there are multiple instances of this component,
 * this will still be a problem as they share the same `stylesNamespace`
 */
class ClearJssServerSide extends React.Component<Props, {}> {
  public componentDidMount() {
    // Misconfiguration in webpack is preventing `$` to be accessed when rendering server side. Have
    // to fallback to calling jQuery
    const jssStyles = jQuery(
      `[data-jss-server-side][data-meta="${this.props.stylesNamespace}"]`,
    )
    if (jssStyles.length) {
      jssStyles.remove()
    }
  }

  public render() {
    return this.props.children
  }
}

export default ClearJssServerSide
