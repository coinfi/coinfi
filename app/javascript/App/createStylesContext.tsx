import * as React from 'react'
import * as _ from 'lodash'
import { SheetsRegistry } from 'jss'
import { createGenerateClassName } from '@material-ui/core/styles'

const createStylesContext = (seed = '') => {
  const sheetsRegistry = new SheetsRegistry()
  const sheetsManager = new Map()
  const generateClassName = createGenerateClassName({ seed })

  return {
    sheetsRegistry,
    sheetsManager,
    generateClassName,
  }
}

export default createStylesContext
