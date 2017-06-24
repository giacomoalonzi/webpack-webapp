/** import external dependencies */
import $ from 'jquery'
/** import local dependencies */
import Router from './util/Router'
import common from './routes/common'
import home from './routes/home'
import aboutUs from './routes/about'

/**
 * Populate Router instance with DOM routes
 * @type {Router} routes - An instance of our router
 */
const routes = new Router({
  /** All pages */
  common,
  /** Home page */
  home,
  /** About Us page, note the change from about-us to aboutUs. */
  aboutUs
})

/** Load Events */
$(document).ready(() => routes.loadEvents())
