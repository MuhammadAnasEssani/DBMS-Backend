// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Product from "App/Models/Product";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import Auth from "App/Models/Auth";

export default class ProductsController {
  productSchema = schema.create({
    name: schema.string({}, [
      rules.maxLength(50),
      rules.minLength(3),
      rules.unique({
        table: 'products', column: 'name',
      }),
    ]),
    price: schema.number([
      rules.unsigned()
    ]),
    quantity: schema.number([
      rules.unsigned()
    ]),
    description: schema.string([rules.maxLength(65535),rules.trim()]),
    discount: schema.number.optional([
      rules.unsigned()
    ]),
    type: schema.enum(
      [Product.TYPE.FEATURES, Product.TYPE.NORMAL] as const
    ),
    categories: schema.array().members(schema.number([
      rules.exists({
        table: 'categories', column: 'id'
      }),
    ])),
    colours : schema.array.optional().members(schema.number([
      rules.exists({
        table: 'colours', column: 'id'
      }),
    ])),
    offers: schema.array.optional().members(schema.number(
      [
        rules.exists({
          table: 'offers', column: 'id'
        }),
      ]
    )),
    sizes: schema.array.optional().members(schema.number(
      [
        rules.exists({
          table: 'sizes', column: 'id'
        }),
      ]
    )),
    // product_pictures: schema.file({
    //   // size: '2mb',
    //   // extnames: ['jpg', 'png'],
    // }),
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
  public async getProducts({ response,request }) {
    try {
      let type = request.input('type',null)
      let refId = request.input('ref_id',null)
      if(type == Product.REQUEST_TYPE.CATEGORY){
        if(!refId){
          return response.status(400).json(this.apiResponse(false,'Ref Id is required'))
        }
        const products = await Product
          .query()
          .preload('pictures')
          .whereIn('id',
            (query) => query.from('category_product').select('product_id').where('category_id',refId)
          )
        return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
      }
      if(type == Product.REQUEST_TYPE.OFFER){
        if(!refId){
          return response.status(400).json(this.apiResponse(false,'Ref Id is required'))
        }
        const products = await Product
          .query()
          .preload('pictures')
          .whereIn('id',
            (query) => query.from('offer_product').select('product_id').where('offer_id',refId)
          )
        return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
      }
      if(type == Product.REQUEST_TYPE.DISCOUNTED){
        const products = await Product
          .query()
          .preload('pictures')
          .where('discount','>',0)
        return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
      }
      if(type == Product.REQUEST_TYPE.FEATURED){
        const products = await Product
          .query()
          .preload('pictures')
          .where('type',Product.TYPE.FEATURES)
        return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
      }
      if(type == Product.REQUEST_TYPE.SHOP){
        if(!refId){
          return response.status(400).json(this.apiResponse(false,'Ref Id is required'))
        }
        const products = await Product
          .query()
          .preload('pictures')
          .where('created_by_id',refId)
        return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
      }
      const products = await Product
        .query()
        .preload('pictures')
      return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async index({ response,auth }) {
    try {
      // const categories = await Category.all()
      const user: any = auth.use('api').user;
      if(user.role == Auth.ROLES.VENDOR){
        const products = await Product
          .query().where('created_by_id',user.id)
          .preload('pictures')
        return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
      }
      const products = await Product
        .query()
        .preload('pictures')
      return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',products))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async store({ request, response,auth }) {
    // const trx = await Database.transaction()
    const images = request.files('product_pictures')
    if (images.length == 0) {
      return response.status(400).json(this.apiResponse(false,"Product Pictutres are required",))
    }
    try {
      // console.log(request.requestBody.categories)
      const product:Product = await Database.transaction( async (trx)=> {
        const user: any = auth.use('api').user;
        request.updateBody({
          ...request.requestBody,
          categories: JSON.parse(request.requestBody.categories),
          colours: JSON.parse(request.requestBody.colours),
          sizes: JSON.parse(request.requestBody.sizes),
          offers: JSON.parse(request.requestBody.offers),
          // product_pictures: JSON.parse(request.requestBody.product_pictures)
        })
        const payload: any = await request.validate({schema: this.productSchema})
        let productPictures: any[] = [];
        for (let image of request.files('product_pictures')) {
          await image.move(Application.tmpPath('uploads/product-pictures'))
          productPictures.push({
            avatar: image.fileName
          })
        }
        const productObj = {
          name: payload.name,
          price: payload.price,
          quantity: payload.quantity,
          description: payload.description,
          type: payload.type,
          createdById: user.id
        }
        if (payload.discount) {
          productObj['discount'] = payload.discount
        }
        const row: Product = await Product.create(productObj, {client: trx})
        // await product
        //   .related('category')
        //   .sync({
        //     [1]: {
        //       name: 'admin'
        //     },
        //     [2]: {
        //       name: 'guest',
        //     }
        //   })
        await row.related('category').attach([...request.requestBody.categories])
        if (request.requestBody.colours.length > 0) {
          await row.related('colour').attach([...request.requestBody.colours])
        }
        if (request.requestBody.offers.length > 0) {
          await row.related('offer').attach([...request.requestBody.offers])
        }
        if (request.requestBody.offers.length > 0) {
          await row.related('size').attach([...request.requestBody.sizes])
        }
        await row
          .related('pictures')
          .createMany([
            ...productPictures
          ])
        return row
      })
      // await trx.commit()
      return response.status(201).json(this.apiResponse(true,'Product Added successfully!',product))
    }catch(error){
      // await trx.rollback()
      // console.log(error)
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const product: any = await Product.query()
        // .query()
        .preload('category')
        .preload('colour')
        .preload('offer')
        .preload('size')
        .preload('pictures')
        .where('id',id).first()
        //.find(id)
      if (!product) {
        return response.status(400).json(this.apiResponse(false,'Product not found'))
      }
      return response.status(200).json(this.apiResponse(true,'Product Fetched successfully!',product))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
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
