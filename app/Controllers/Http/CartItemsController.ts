// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CartItem from "App/Models/CartItem";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Cart from "App/Models/Cart";


export default class CartItemsController {
  cartItemSchema = schema.create({
    // cart_id: schema.number(),
    product_vendor_id: schema.number([
      rules.exists({
        table: 'auths', column: 'id'
      }),
      rules.unsigned()
    ]),
    product_id: schema.number([
      rules.exists({
        table: 'products', column: 'id'
      }),
      rules.unsigned()
    ]),
    qty: schema.number([
      rules.unsigned()
    ]),
    payable_price: schema.number([
      rules.unsigned()
    ])
  })
  apiResponse(status,message: string, data?: any) {
    /*
    * Standard Structured api output
    * */
    return {
      status: status,
      message,
      // data: data ? typeof data.toJSON != 'undefined' ? data.toJSON() : data : null
      data: data || null,
    }
  }
  public async index({ response ,auth}) {
    try {
      const user: any = auth.use('api').user;
      let cart = await Cart.query().where('user_id',user.id).first()
      if(!cart){
        return response.status(200).json(this.apiResponse(true,'Cart Items Fetched successfully!',[]))
      }
      const cart_items = await CartItem
        .query()
        .where('cart_id',cart.id)
        .preload('product')
      return response.status(200).json(this.apiResponse(true,'Cart Items Fetched successfully!',cart_items))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async store({ request, response,auth }) {
    try {
      const user: any = auth.use('api').user;
      let cart = await Cart.query().where('user_id',user.id).first()
      if(!cart){
        cart = await Cart.create({
          user_id: user.id
        })
      }
      const payload: any = await request.validate({schema: this.cartItemSchema})
      const cart_item: CartItem = await CartItem.create({
        cart_id: cart.id,
        ...payload
      })
      return response.status(201).json(this.apiResponse(true,'Cart Item Added successfully!',cart_item))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
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
