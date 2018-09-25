import * as _ from 'lodash'
import inflection from 'lodash-inflection'
_.mixin(inflection)

export const pluralize = (word) => _.pluralize(word)
export const singularize = (word) => _.singularize(word)
