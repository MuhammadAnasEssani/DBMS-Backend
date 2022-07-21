// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Order from "App/Models/Order";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import UserAddress from "App/Models/UserAddress";
import Database from "@ioc:Adonis/Lucid/Database";
import Cart from "App/Models/Cart";

export default class OrdersController {
  orderSchema = schema.create({
    user_address: schema.object().members({
      name: schema.string( [
        rules.trim(),
        rules.maxLength(20),
        rules.minLength(3)
      ]),
      mobile_number: schema.string(),
      pin_code: schema.number(),
      address: schema.string( [
        rules.trim(),
        rules.maxLength(255),
        rules.minLength(3)
      ]),
      city: schema.string([
        rules.trim(),
        rules.maxLength(100),
        rules.minLength(3)
      ]),
      state: schema.string( [
        rules.trim(),
        rules.maxLength(100),
        rules.minLength(3)
      ]),
      country: schema.string( [
        rules.trim(),
        rules.maxLength(100),
        rules.minLength(3)
      ]),
    }),
    order_items: schema.array().members(
      schema.object().members({
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
        purchased_qty: schema.number([
          rules.unsigned()
        ]),
        payable_price: schema.number([
          rules.unsigned()
        ])
      })
    ),
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
  public async index({ response,auth }) {
    try {
      const user: any = auth.use('api').user;
      if(user.role == 10){
        const orders = await Order
          .query()
          .where('user_id',user.id)
          .preload('order_items')
          .preload('user')
        return response.status(200).json(this.apiResponse(true,'Order Fetched successfully!',orders))
      }
      if(user.role == 20){
        const orders = await Order
          .query()
          .whereIn('id',
            (query) => query.from('order_items').select('order_id').where('product_vendor_id',user.id)
          )
          .preload('order_items')
          .preload('user')
        return response.status(200).json(this.apiResponse(true,'Order Fetched successfully!',orders))
      }
      const orders = await Order
        .query()
        .preload('order_items')
        .preload('user')
      return response.status(200).json(this.apiResponse(true,'Order Fetched successfully!',orders))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,error))
    }
  }
  public async store({ request, response,auth }) {
    try {
      const order:Order = await Database.transaction( async (trx)=> {
        const user: any = auth.use('api').user;
        const payload: any = await request.validate({schema: this.orderSchema})
        const user_address: UserAddress = await UserAddress.create({
          ...payload.user_address,
          user_id: user.id
        },{client: trx})
        const order: Order = await Order.create({
          user_id: user.id,
          user_address_id: user_address.id
        },{client: trx})
        await order
          .related('order_items')
          .createMany(
            payload.order_items
          )
        const cart: any = await Cart.query().where('user_id',user.id).first()
        await cart.delete({client: trx})
        return order
      })
      return response.status(201).json(this.apiResponse(true,'Order Added successfully!',order))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,error))
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const order: any = await Order
        .query()
        .preload('order_items')
        .preload('address')
        .where('id',id).first()
      if (!order) {
        response.status(400).json(this.apiResponse(false,"Order Not Found"))
      }
      return response.status(200).json(this.apiResponse(true,'Order Fetched successfully!',order))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,error))
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params

      const order: any = await Order.find(id)
      if (!order) {
        return response.notFound({ message: 'Order not found' })
      }

      await order.delete()

      return response.ok({ message: 'Order deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
