// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import OrderItem from "App/Models/OrderItem";

export default class OrderItemsController {
  public async index({ response }) {
    try {
      const order_items = await OrderItem.all()
        // .query()
        // .preload('order_items')
      return response.ok(order_items)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const order_item: any = await OrderItem
        .find(id)
      if (!order_item) {
        return response.notFound({ message: 'Order Item not found' })
      }
      return response.ok(order_item)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params

      const order_item: any = await OrderItem.find(id)
      if (!order_item) {
        return response.notFound({ message: 'Order Item not found' })
      }

      await order_item.delete()

      return response.ok({ message: 'Order Item deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
