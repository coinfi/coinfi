import baseState from './initialState'
import {createFilterReducer, createEntityReducer} from './index'

export default ({namespace, filterList}, initialState, reducer) => {
  let newState = baseState.mergeDeep(initialState)
  return (state = newState, action) => {
    const reducers = [createEntityReducer(namespace), reducer]
    if (filterList) reducers.push(createFilterReducer({namespace, filterList}))
    reducers.forEach(reduce => {
      state = reduce(state, action)
    })
    return state
  }
}
