/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Auth from "App/Models/Auth";

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})


Route
  .group(() => {
    Route.resource('user', 'userAuthsController')
    Route.post('login','userAuthsController.login')
    Route.patch('verify-user/:code','userAuthsController.verify')
    Route.resource('vendor', 'vendorAuthsController')
    Route.post('vendor-login','vendorAuthsController.login')
    // Route
    //   .group(() => {
    Route.resource('category', 'categoriesController').middleware({
      store: ['auth',`role:${Auth.ROLES.VENDOR},${Auth.ROLES.ADMIN}`]
    })
    // }).middleware(['auth',`role:${Auth.ROLES.VENDOR},${Auth.ROLES.ADMIN}`])
    Route.resource('product', 'productsController')
    Route.resource('colour', 'colorsController')
    Route.resource('size', 'sizesController')
    Route.resource('offer', 'offersController')
    Route.resource('cart', 'cartsController')
    Route.resource('cart-items', 'cartItemsController')
    Route.resource('user-address', 'userAddressesController')
    Route.resource('order', 'ordersController')
    Route.resource('order-items', 'orderItemsController')
  })
  .prefix('/api')

