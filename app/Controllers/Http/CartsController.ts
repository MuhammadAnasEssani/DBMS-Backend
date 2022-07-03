// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cart from "App/Models/Cart";
import { schema} from "@ioc:Adonis/Core/Validator";

export default class CartsController {
  cartSchema = schema.create({
    user_id: schema.number()
  })
  public async index({ response }) {
    try {
      const carts = await Cart
        .query()
        .preload('cart_items')
      return response.ok(carts)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.cartSchema})
      const cart: Cart = await Cart.create(payload)
      return response.ok(cart)
    }catch(error){
      response.badRequest(error.messages)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const cart: any = await Cart.find(id)
      if (!cart) {
        return response.notFound({ message: 'Cart not found' })
      }
      return response.ok(cart)
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
