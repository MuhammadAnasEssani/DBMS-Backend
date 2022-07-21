// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from "App/Models/Category";
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import Auth from "App/Models/Auth";

export default class CategoriesController {
  categorySchema = schema.create({
    name: schema.string({}, [
      rules.trim(),
      rules.maxLength(50),
      rules.unique({
        table: 'categories', column: 'name',
      }),
    ]),
    description: schema.string([rules.maxLength(65535),rules.trim()]),
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
  public async getAllCategories({ response }) {
    try {

      const categories = await Category
        .query()
      return response.status(200).json(this.apiResponse(true,'Category Fetched successfully!',categories))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async index({ response,auth }) {
    try {
      // const categories = await Category.all()
      const user: any = auth.use('api').user;
      if(user.role == Auth.ROLES.VENDOR){
        const categories = await Category
          .query().where('created_by_id',user.id)
        return response.status(200).json(this.apiResponse(true,'Category Fetched successfully!',categories))
      }
      const categories = await Category
        .query()
      return response.status(200).json(this.apiResponse(true,'Category Fetched successfully!',categories))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async store({ request, response,auth }) {
    try {
      const user: any = auth.use('api').user;
      const payload: any = await request.validate({schema: this.categorySchema})
      const category: Category = await Category.create({
        ...payload,
        createdById: user.id
      })
      return response.status(201).json(this.apiResponse(true,'Category Added successfully!',category))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const category: any = await Category.find(id)
      if (!category) {
        return response.status(400).json(this.apiResponse(false,'Category not found'))
      }
      return response.status(201).json(this.apiResponse(true,'Category Added successfully!',category))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async update({ request, params, response }) {
    try{
      const payload: any = await request.validate({ schema: this.categorySchema })

      const { id }: { id: Number } = params

      const category: any = await Category.find(id)
      if (!category) {
        return response.status(400).json(this.apiResponse(false,"Category not Found"))
      }

      category.name = payload.name
      category.description = payload.description

      const newCategory =await category.save()

      return response.status(201).json(this.apiResponse(true,'Category Updated successfully!',newCategory))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const category: any = await Category.find(id)
      if (!category) {
        return response.status(400).json(this.apiResponse(false,"Category not Found"))
      }
      await category.delete()
      return response.status(204).json(this.apiResponse(true,'Category Deleted successfully!',category))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
}
