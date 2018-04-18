/*
 * Normally this file would mount the app on the
 * document body, as well as provide the store, routes
 * etc., however this is not an SPA, so it just looks for 
 * elements (via /initializers) in order to render the
 * React components.
 */
import 'babel-polyfill'
import './initializers/social'
import './initializers/watchlist'
import './initializers/globalCoinSearch'
