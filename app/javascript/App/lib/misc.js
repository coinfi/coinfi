import _ from 'lodash'
import inflection from 'lodash-inflection'
_.mixin(inflection)

export const pluralize = (word) => _.pluralize(word)
