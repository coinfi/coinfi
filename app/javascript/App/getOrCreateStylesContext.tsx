import { SheetsRegistry } from 'jss'
import { createGenerateClassName } from '@material-ui/core/styles'
import * as _ from 'lodash'

const stylesContextStore = {}

const createStylesContext = (seed) => {
  const sheetsRegistry = new SheetsRegistry()
  const sheetsManager = new Map()
  const generateClassName = createGenerateClassName({ seed })

  return {
    sheetsRegistry,
    sheetsManager,
    generateClassName,
  }
}

const getOrCreateStylesContext = (seed) => {
  if (_.has(stylesContextStore, seed)) {
    return stylesContextStore[seed]
  }

  stylesContextStore[seed] = createStylesContext(seed)
  return stylesContextStore[seed]
}

export default getOrCreateStylesContext
