// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Order from "App/Models/Order";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class OrdersController {
  orderSchema = schema.create({
    user_id: schema.number(),
    payment_status: schema.string({}, [
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    payment_type: schema.string({}, [
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    order_status: schema.string({}, [
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    user_address_id: schema.number()
  })
  public async index({ response }) {
    try {
      const orders = await Order
        .query()
        .preload('order_items')
      return response.ok(orders)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.orderSchema})
      const order: Order = await Order.create(payload)
      await order
        .related('order_items')
        .createMany([
          ...request.requestBody.order_items
        ])
      return response.ok(order)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const order: any = await Order
        .find(id)
      if (!order) {
        return response.notFound({ message: 'Order not found' })
      }
      return response.ok(order)
    }catch(error){
      response.badRequest(error.message)
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
