// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CartItem from "App/Models/CartItem";
import {schema} from "@ioc:Adonis/Core/Validator";


export default class CartItemsController {
  cartItemSchema = schema.create({
    cart_id: schema.number(),
    product_vendor_id: schema.number(),
    product_id: schema.number(),
    qty: schema.number()
  })
  public async index({ response }) {
    try {
      const cart_items = await CartItem.all()
        // .query()
        // .preload('product')
      return response.ok(cart_items)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.cartItemSchema})
      const cart_item: CartItem = await CartItem.create(payload)
      return response.ok(cart_item)
    }catch(error){
      response.badRequest(error.messages)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const cart_item: any = await CartItem.find(id)
      if (!cart_item) {
        return response.notFound({ message: 'Cart Item not found' })
      }
      return response.ok(cart_item)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const cart_item: any = await CartItem.find(id)
      if (!cart_item) {
        return response.notFound({ message: 'Cart Item not found' })
      }
      await cart_item.delete()
      return response.ok({ message: 'Cart Item deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
