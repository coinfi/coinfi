// Generic, reusable sagas

import {call, put, select} from 'redux-saga/effects'
import API from '../localAPI'

export default {
  get,
  patch,
  post,
  destroy,
}
export function* get(url, params, callback, selector = false) {
  try {
    let response = null
    if (selector) {
      response = yield select(selector())
    }
    if (!response) {
      response = yield call(API.get, url, params)
    }
    yield handleResponse(callback, response, url)
  } catch (e) {
    yield handleError(e)
  }
}

export function* patch(url, params, callback) {
  try {
    const response = yield call(API.patch, url, params)
    yield handleResponse(callback, response, url)
  } catch (e) {
    yield handleError(e)
  }
}

export function* post(url, params, callback) {
  try {
    const response = yield call(API.post, url, params)
    yield handleResponse(callback, response, url)
    return response
  } catch (e) {
    yield handleError(e)
    return e
  }
}

export function* destroy(url, params, callback) {
  try {
    const response = yield call(API.delete, url, params)
    yield handleResponse(callback, response, url)
  } catch (e) {
    yield handleError(e)
  }
}

function handleError({error}) {
  console.log(error)
}

function* handleResponse(callback, response, url) {
  const {type, payload, message} = response
  if (!response) {
    console.warn(`No response from: ${url}`)
    return
  } else if (type === 'warning') {
    console.warn(`Warning from: ${url}\n${response.message}`)
  } else if (message) {
    console.log(message)
  }
  yield put(callback(payload))
}
