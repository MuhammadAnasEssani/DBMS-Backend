// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Product from "App/Models/Product";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'

export default class ProductsController {
  productSchema = schema.create({
    name: schema.string({}, [
      rules.maxLength(50),
      rules.minLength(3)
    ]),
    price: schema.number(),
    quantity: schema.number(),
    description: schema.string({}, [

    ]),
    discount: schema.number.optional(),
    created_by_id: schema.number(),
    type: schema.string({}, [
      rules.maxLength(50)
    ]),
    status: schema.string({}, [
      rules.maxLength(50)
    ]),
    updated_by_id: schema.number.optional( ),
    categories: schema.array().members(schema.string()),
    // colours : schema.array().members(schema.string()),
    // offers: schema.array().members(schema.string()),
    // sizes: schema.array().members(schema.string()),
    // product_pictures: schema.file({
    //   size: '2mb',
    //   extnames: ['jpg', 'png'],
    // }),
  })
  public async index({ response }) {
    try {
      const products = await Product
        .query()
        .preload('category')
        .preload('colour')
        .preload('offer')
        .preload('size')
        .preload('pictures')
        .preload('cart_items')
        .preload('order_items')
      return response.ok(products)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async store({ request, response }) {
    const trx = await Database.transaction()
    try {
       // console.log(request.requestBody.categories)
      const images = request.files('product_pictures')
      if (images.length == 0) {
        return response.notFound({ message: 'Product pictures are required' })
      }
      let productPictures:any[] = [

      ];
      for (let image of images) {
        await image.move(Application.tmpPath('uploads/product-pictures'))
        productPictures.push({
          avatar : image.fileName
        })
      }
        const payload: any = await request.validate({schema: this.productSchema})
        const product: Product = await Product.create(payload,trx)
      await product
        .related('category')
        .sync({
          [1]: {
            name: 'admin'
          },
          [2]: {
            name: 'guest',
          }
        })
      // await product.related('category').attach([...request.requestBody.categories])
        // await product.related('colour').attach([...request.requestBody.colours])
        // await product.related('offer').attach([...request.requestBody.offers])
        // await product.related('size').attach([...request.requestBody.sizes])
      await product
        .related('pictures')
        .createMany([
          ...productPictures
        ])
      await trx.commit()
        return response.ok(product)
    }catch(error){
      await trx.rollback()
      // console.log(error)
      response.badRequest(error.message)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const product: any = await Product
        // .query()
        // .preload('category')
        // .preload('colour')
        // .preload('offer')
        // .preload('size')
        // .preload('pictures')
        .find(id)
      if (!product) {
        return response.notFound({ message: 'Product not found' })
      }
      return response.ok(product)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params

      const product: any = await Product.find(id)
      if (!product) {
        return response.notFound({ message: 'Product not found' })
      }

      await product.delete()

      return response.ok({ message: 'Product deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
